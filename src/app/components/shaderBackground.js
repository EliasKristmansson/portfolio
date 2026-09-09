"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ShaderBackground() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        const uniforms = {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uResolution: {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight),
            },
            uHueShift: { value: 0 },
        };

        const vertexShader = `
            varying vec2 vUv;

            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            varying vec2 vUv;

            uniform float uTime;
            uniform vec2 uMouse;
            uniform vec2 uResolution;
            uniform float uHueShift;

            void main() {
                vec2 uv = vUv;

                float wave = sin(
                    uv.x * 8.0 +
                    uv.y * 5.0 +
                    uTime
                );

                float mouseDistance = distance(uv, uMouse);
                float mouseGlow = 1.0 - smoothstep(0.0, 0.5, mouseDistance);

                vec3 pink = vec3(0.894, 0.502, 0.596);
                vec3 blue = vec3(0.145, 0.706, 0.941);

                float blend = wave * 0.5 + 0.5;
                blend += mouseGlow * 0.25;

                vec3 color = mix(pink, blue, blend);

                gl_FragColor = vec4(color * 0.35, 1.0);
            }
        `;

        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader,
        });

        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const timer = new THREE.Timer();
        timer.connect(document);

        function animate(timestamp) {
            timer.update(timestamp);
            uniforms.uTime.value = timer.getElapsed();
            renderer.render(scene, camera);
        }

        renderer.setAnimationLoop(animate);

        const handleMouseMove = (event) => {
            uniforms.uMouse.value.set(
                event.clientX / window.innerWidth,
                1 - event.clientY / window.innerHeight
            );
        };

        const handleResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            uniforms.uResolution.value.set(
                window.innerWidth,
                window.innerHeight
            );
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("resize", handleResize);

        return () => {
            renderer.setAnimationLoop(null);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            timer.dispose();
            container.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={containerRef} className="shader-background" />;
}