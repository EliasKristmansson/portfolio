"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Standard-vertex-shader som bara skickar vidare UV-koordinater rakt av.
// Du kommer nästan aldrig behöva röra den här — allt visuellt jobb
// (färger, flöden, mönster) sker per pixel i fragment-shadern nedan,
// inte per vertex.
const DEFAULT_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

/**
 * Shader — generisk "motor" som kör vilken fragment-shader du än
 * skickar in. Den vet ingenting om VAD den ritar, bara HUR den
 * monteras, storleksanpassas och städas upp. Innehållet (dina egna
 * shaders) håller du separat, se components/shaders/-mappen.
 *
 * Placeras absolut och fyller sin närmaste förälder med
 * position: relative — så du kan slänga in en <Shader /> bakom
 * hela sidan, eller bara inuti en enskild sektion.
 */
export default function Shader({
    fragmentShader,
    vertexShader = DEFAULT_VERTEX,
    uniforms: customUniforms = {},
    className = "",
}) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas || !fragmentShader) return;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true, // så sektionen bakom kan lysa igenom om du vill det
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const uniforms = {
            uTime: { value: 0 },
            uResolution: { value: new THREE.Vector2(1, 1) },
            uScroll: { value: 0 },
            ...customUniforms,
        };

        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
            transparent: true,
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Storleken följer FÖRÄLDERN, inte fönstret. Det är den detaljen
        // som gör komponenten placerbar var som helst — i en liten sektion
        // blir shadern lika liten, ingen extra logik behövs.
        const resizeObserver = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect;
            if (width === 0 || height === 0) return;
            renderer.setSize(width, height, false);
            uniforms.uResolution.value.set(width, height);
        });
        resizeObserver.observe(container);

        const scrollContainer = container.closest("[data-scroll-container]");

        function handleScroll() {
            if (scrollContainer) {
                uniforms.uScroll.value = scrollContainer.scrollTop;
            }
        }
        scrollContainer?.addEventListener("scroll", handleScroll, { passive: true });

        let frameId;
        const startTime = performance.now();

        function animate(timestamp) {
            uniforms.uTime.value = (timestamp - startTime) / 1000;
            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        }
        animate();

        // Städning. Kritiskt i Next.js dev-läge — utan detta läcker varje
        // hot-reload en ny WebGL-kontext tills webbläsaren säger ifrån
        // ("Too many active WebGL contexts").
        return () => {
            cancelAnimationFrame(frameId);
            resizeObserver.disconnect();
            scrollContainer?.removeEventListener("scroll", handleScroll);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, [fragmentShader, vertexShader, customUniforms]);

    return (
        <div ref={containerRef} className={`absolute inset-0 -z-10 ${className}`}>
            <canvas ref={canvasRef} className="block h-full w-full" />
        </div>
    );
}