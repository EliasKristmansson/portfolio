export const exampleFragment = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uScroll;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

    float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
    }

  void main() {
    vec2 uv = vUv;
    vec2 aspectCorrected = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

    // skrollen skjuter flödesfältet vertikalt — det är det som ger
    // "rör sig när man skrollar"-känslan, inte bara tid
    float scrollOffset = uScroll * 0.0015;

    vec2 warp = aspectCorrected * 1.3 + vec2(0.0, scrollOffset);
    warp += vec2(noise(warp + uTime * 0.04), noise(warp - uTime * 0.04));

    float n = fbm(warp);

    vec3 blue = vec3(0.063, 0.082, 0.110);  // #10151c
    vec3 pink = vec3(0.141, 0.082, 0.114);  // #24151d

    float colorPhase = n * 2.2 + uScroll * 0.00025;
    float contrast = 0.5 + 0.5 * sin(colorPhase * 6.28318);

    vec3 base = mix(blue, pink, contrast);
    base *= 0.55 + 0.25 * noise(warp * 0.9 + 3.0);

    // Glans: kopplad till FÄRGENS toppar, inte ett eget slumpfält.
    // "purity" = 1 exakt där färgen är som mest renodlat rosa eller
    // blå (topparna i sin-kurvan ovan), 0 vid övergångarna mellan dem.
    float purity = abs(sin(colorPhase * 6.28318));
    float texture = noise(warp * 2.6 - scrollOffset * 0.6);
    float sheen = pow(purity, 6.0) * pow(texture, 2.0);
    vec3 sheenColor = mix(blue, pink, contrast) * 2.6;

    vec3 color = base + sheen * sheenColor;

    gl_FragColor = vec4(color, 1.0);
  }
`;