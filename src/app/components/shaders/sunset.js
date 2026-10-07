// Var solen sitter horisontellt (0 = vänster, 1 = höger)
const SUN_X = 0.84;

// Horisontens läge som andel av sektionens höjd (uppifrån)
const HORIZON_FRAC = 0.53;

// Hur mycket lägre horisonten ligger i mitten än vid sidokanterna (andel av höjden)
const ARCH_FRAC = 0.18;

// Mest ogenomskinliga himlen; under 1 så att nattstjärnorna syns genom den
const MAX_SKY_ALPHA = 0.96;

// Hur snabbt himlen driver (stjärnhimlen roterar ungefär i den takten)
const DRIFT_SPEED = 0.08;

export const sunsetFragment = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;

  const float SUN_X = ${SUN_X.toFixed(3)};
  const float HORIZON_FRAC = ${HORIZON_FRAC.toFixed(3)};
  const float ARCH_FRAC = ${ARCH_FRAC.toFixed(3)};
  const float GROUND_FADE_FRAC = 0.30;
  const float MAX_SKY_ALPHA = ${MAX_SKY_ALPHA.toFixed(3)};

  // Samma palett som resten av sidan (midnight-dark, sky, rose, amber)
  const vec3 DARK  = vec3(0.0549, 0.0549, 0.0588);
  const vec3 SKY   = vec3(0.0392, 0.7098, 1.0);
  const vec3 ROSE  = vec3(1.0, 0.4784, 0.6078);
  const vec3 AMBER = vec3(1.0, 0.4980, 0.0902);

  
  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash12(i), hash12(i + vec2(1.0, 0.0)), f.x),
      mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(7.1, 3.7);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uResolution;
    float aspect = uResolution.x / uResolution.y;
    float x = vUv.x;
    float t = uTime * ${DRIFT_SPEED.toFixed(3)};

    // Böljande horisont: långsamma vågor plus lite brus, så den aldrig blir en rak linje
    float wave = (fbm(vec2(x * 2.2 + t, 1.7 + t * 0.5)) - 0.5) * 130.0
           + sin(x * 5.0 + t * 3.0) * 22.0;
    float edge = (x - 0.5) * 2.0;
    float arch = ARCH_FRAC * uResolution.y * (1.0 - edge * edge);
    float horizon = uResolution.y * HORIZON_FRAC + wave + arch;

    // s: 0 högst upp, 1 vid horisonten, >1 under den
    float s = px.y / horizon;

    // Mjuka, vågiga band som vrider sig lite i sidled
    float warp = (fbm(vec2(x * 3.0 - t, s * 2.4 + t * 0.7)) - 0.5) * 0.16;
    float k = clamp(s + warp, 0.0, 1.0);

    // Himlen går från kall natt via rosa till amber vid horisonten
    vec3 col = mix(DARK, mix(DARK, SKY, 0.16), smoothstep(0.0, 0.35, k));
    col = mix(col, mix(DARK, ROSE, 0.30), smoothstep(0.28, 0.72, k));
    col = mix(col, mix(DARK, AMBER, 0.42), smoothstep(0.62, 1.0, k));

    // Solen: starkare amber nära horisonten, mest åt höger
    float sunX = SUN_X + sin(uTime * ${DRIFT_SPEED.toFixed(3)}) * 0.03;
    vec2 sunPos = vec2(sunX * aspect, 0.0);
    vec2 q = vec2(x * aspect, (px.y - horizon) / uResolution.y * 1.0);
    float sunDist = length((q - sunPos) * vec2(1.0, 2.2));
    float sun = exp(-sunDist * sunDist * 9.0);
    float halo = exp(-sunDist * 2.4) * 0.35;
    col += AMBER * sun * 0.55 + ROSE * halo * 0.22;

    // Svagare glöd längre åt vänster så färgen blir ojämn och naturlig
    float side = exp(-pow((x - 0.22 - sin(uTime * 0.015) * 0.08) * 2.4, 2.0)) * smoothstep(0.55, 1.0, k);
    col += mix(ROSE, AMBER, 0.5) * side * 0.12;

    // Alfa: genomskinlig högst upp så att nattskyn sömlöst tar över
    float alpha = pow(clamp(s + warp * 0.5, 0.0, 1.0), 2.1) * MAX_SKY_ALPHA;
    alpha = max(alpha, sun * 0.5);

    // Under horisonten: bleka snabbt mot mörkt, med en liten rosa ton nära kanten
    float below = clamp((px.y - horizon) / (uResolution.y * GROUND_FADE_FRAC), 0.0, 1.0);
    float ground = smoothstep(0.0, 1.0, below);
    vec3 groundCol = mix(col, mix(DARK, ROSE, 0.04), ground);
    col = mix(col, groundCol, step(0.0, px.y - horizon));
    alpha = mix(alpha, 1.0, smoothstep(0.0, 0.35, below));

    // Dither mot banding i de mörka partierna
    float n = hash12(px + fract(uTime) * 17.0) - 0.5;
    col += n / 255.0 * 1.5;

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), clamp(alpha, 0.0, 1.0));
  }
`;
