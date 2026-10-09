export const planetFragment = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uRotation;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  const float RADIUS = 0.74;
  const vec3 LIGHT = vec3(0.78, 0.30, 0.55); // from the right, like the sun in the sky

  float hash13(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.zyx + 31.32);
    return fract((p.x + p.y) * p.z);
  }

  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash13(i), hash13(i + vec3(1.0, 0.0, 0.0)), f.x),
          mix(hash13(i + vec3(0.0, 1.0, 0.0)), hash13(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
      mix(mix(hash13(i + vec3(0.0, 0.0, 1.0)), hash13(i + vec3(1.0, 0.0, 1.0)), f.x),
          mix(hash13(i + vec3(0.0, 1.0, 1.0)), hash13(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
      f.z
    );
  }

  float fbm3(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise3(p);
      p = p * 2.02 + vec3(5.2, 1.3, 8.1);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = (vUv - 0.5) * 2.0;
    uv.x *= uResolution.x / uResolution.y;
    float d = length(uv);

    // Sphere normal for this pixel (z points toward the viewer)
    vec3 n = vec3(uv / RADIUS, 0.0);
    n.z = sqrt(max(1.0 - dot(n.xy, n.xy), 0.0));

    // Rotate around Y: the surface turns, the light stays put
    float c = cos(uRotation);
    float s = sin(uRotation);
    vec3 p = vec3(c * n.x + s * n.z, n.y, -s * n.x + c * n.z);

    // Surface: warped bands + noise patches in the project's palette
    float warp = fbm3(p * 2.0 + 3.0);
    float bands = sin((p.y + warp * 0.55) * 8.0) * 0.5 + 0.5;
    float patches = fbm3(p * 3.2 + vec3(9.0, 2.0, 4.0));
    vec3 surface = mix(uColorA, uColorB, bands);
    surface = mix(surface, uColorC, smoothstep(0.5, 0.75, patches));

    // Lighting + atmosphere rim
    float diff = max(dot(n, normalize(LIGHT)), 0.0);
    vec3 planet = surface * (0.15 + 0.85 * smoothstep(0.0, 0.6, diff));
    float rim = pow(1.0 - n.z, 3.0);
    planet += uColorC * rim * (0.15 + 0.85 * diff) * 0.9;

    // Edge, and a soft glow outside the sphere that fades before the canvas edge
    float edge = 1.0 - smoothstep(RADIUS - 0.006, RADIUS, d);
    float outside = max(d - RADIUS, 0.0);
    float glow = exp(-outside * 8.0) * 0.45 * (1.0 - edge);
    glow *= 1.0 - smoothstep(0.8, 1.0, d);
    glow *= 0.35 + 0.65 * max(dot(normalize(uv + 0.0001), normalize(LIGHT.xy)), 0.0);

    vec3 col = mix(uColorC, planet, edge);
    gl_FragColor = vec4(col, max(edge, glow));
  }
`;