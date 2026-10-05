const COLOR_OPACITY = 0.55;

export const exampleFragment = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uScroll;
  uniform float uDarkness;

  const float PI = 3.14159265;
  const float FOCAL = 0.866;                       // ~60° vertikalt synfält

  // Vintergatans plan (normal) – används bara för att samla stjärnor i ett band
  const vec3 GAL_N = vec3(0.4444, 0.8889, 0.1111);

  // ---------- Hash & brus ----------

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  vec3 hash33(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.xxy + p.yxx) * p.zyx);
  }

  // ---------- Kamera ----------

  mat3 rotX(float a) {
    float c = cos(a); float s = sin(a);
    return mat3(1.0, 0.0, 0.0,  0.0, c, s,  0.0, -s, c);
  }
  mat3 rotY(float a) {
    float c = cos(a); float s = sin(a);
    return mat3(c, 0.0, -s,  0.0, 1.0, 0.0,  s, 0.0, c);
  }
  mat3 rotZ(float a) {
    float c = cos(a); float s = sin(a);
    return mat3(c, s, 0.0,  -s, c, 0.0,  0.0, 0.0, 1.0);
  }

  float galBand(vec3 dir) {
    float lat = dot(dir, GAL_N);
    return exp(-lat * lat * 14.0);
  }

  // ---------- Stjärnfärg ----------
  // Nästan vita stjärnor med en svag tint från de tre temafärgerna.
  // Samma tre-vägs cykliska vikt som förut, så en stjärna kan vara en
  // blandning av t.ex. blå och rosa. COLOR_OPACITY styr hur stark tinten är.

  vec3 starTint(float t) {
    float wave = t * 6.28318 + uScroll * 0.0004;
    float wBlue   = pow(max(cos(wave), 0.0), 2.0);
    float wPink   = pow(max(cos(wave - 2.09439), 0.0), 2.0);
    float wOrange = pow(max(cos(wave - 4.18879), 0.0), 2.0);
    float wSum = wBlue + wPink + wOrange + 0.0001;

    vec3 vividBlue   = vec3(0.145, 0.706, 0.941);
    vec3 vividPink   = vec3(0.894, 0.502, 0.596);
    vec3 vividOrange = vec3(0.984, 0.573, 0.235);

    vec3 tint = (vividBlue * wBlue + vividPink * wPink + vividOrange * wOrange) / wSum;
    return mix(vec3(1.0, 0.97, 0.94), tint, ${COLOR_OPACITY} * 1.4);
  }

  // ---------- Stjärnlager ----------
  // Stjärnor ligger i en 3D-cellrymd och projiceras på himmelssfären.
  // För de större lagren (big = true) kollas även de 26 granncellerna, och
  // varje stjärna tonas mjukt ut både i sidled och i djupled. Då kan ingen
  // stjärna kapas av en cellkant när kameran roterar.

  vec3 starLayer(mat3 cam, vec3 ray, float scale, float density, float size,
                 float seed, float spikeAmt, float pxAngle, bool big) {
    vec3 dir   = normalize(cam * ray);
    vec3 right = cam[0];
    vec3 up    = cam[1];

    float band = galBand(dir);
    float dens = clamp(density * (1.0 + 1.5 * band), 0.0, 1.0);

    vec3 p   = dir * scale + seed * 13.37;
    vec3 id0 = floor(p);
    vec3 acc = vec3(0.0);

    for (int x = -1; x <= 1; x++) {
      for (int y = -1; y <= 1; y++) {
        for (int z = -1; z <= 1; z++) {
          if (!big && (x != 0 || y != 0 || z != 0)) continue;

          vec3 id = id0 + vec3(float(x), float(y), float(z));
          vec3 h = hash33(id + seed);
          if (h.x > dens) continue;

          vec3 h2 = hash33(id * 1.7 + seed + 5.1);
          vec3 sp = id + vec3(0.5) + (h2 - 0.5) * 0.5;

          vec3 rel = sp - p;
          float radial = dot(rel, dir);
          vec3 d3 = rel - dir * radial;                // avstånd längs himlen
          float dist = length(d3);

          // Mjuk tonning i djupled och sidled (hindrar skarpa avskärningar)
          float wgt = 1.0;
          if (big) {
            wgt = smoothstep(0.6, 0.3, abs(radial)) * smoothstep(0.4, 0.15, dist);
          }
          if (wgt <= 0.0) continue;

          float mag   = pow(h.y, 3.0);                 // få ljusstarka, många svaga
          float rBase = size * (0.35 + 0.65 * mag);
          float pxCell = pxAngle * scale;
          float r = max(rBase, pxCell * 0.8);          // aldrig under ~1 pixel
          float energy = mix(0.35, 1.0, clamp(rBase / r, 0.0, 1.0));

          float core = exp(-(dist * dist) / (r * r));
          float halo = exp(-dist / (r * 3.5));
          float s = core + halo * (0.05 + 0.5 * mag);

          if (spikeAmt > 0.0) {
            float ax = abs(dot(d3, right));
            float ay = abs(dot(d3, up));
            float s1 = exp(-ay / (r * 0.6)) * exp(-ax / (r * 8.0));
            float s2 = exp(-ax / (r * 0.6)) * exp(-ay / (r * 8.0));
            s += (s1 + s2) * 0.5 * mag * spikeAmt;
          }

          float amp = (0.25 + 2.2 * mag) * energy;
          float tw  = 0.82 + 0.18 * sin(uTime * (1.2 + 3.0 * h2.x) + h2.y * 60.0);

          acc += starTint(h2.z) * s * amp * tw * wgt;
        }
      }
    }
    return acc;
  }

  // ---------- Meteor ----------

  vec3 meteor(vec2 p) {
    float t  = uTime / 8.0;
    float id = floor(t);
    float ft = fract(t);
    if (hash12(vec2(id, 3.1)) < 0.45) return vec3(0.0);
    float prog = ft / 0.10;
    if (prog > 1.0) return vec3(0.0);

    vec2 start = vec2(mix(-0.6, 0.7, hash12(vec2(id, 7.7))),
                      mix(0.1, 0.45, hash12(vec2(id, 1.3))));
    vec2 dir  = normalize(vec2(-0.85, -0.5 - 0.3 * hash12(vec2(id, 9.1))));
    vec2 head = start + dir * prog * 0.55;
    float len = 0.2 * sin(prog * PI);
    vec2 tail = head - dir * len;

    vec2 pa = p - tail;
    vec2 ba = head - tail;
    float hh = clamp(dot(pa, ba) / max(dot(ba, ba), 0.00001), 0.0, 1.0);
    float d  = length(pa - ba * hh);

    float fade = sin(prog * PI);
    float line = smoothstep(0.0022, 0.0, d) * hh * hh;
    float glow = exp(-length(p - head) * 220.0) * 0.5;
    return vec3(0.85, 0.92, 1.0) * (line * 1.4 + glow) * fade;
  }

  // ---------- Main ----------

  void main() {
    vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
    vec3 ray = normalize(vec3(p, -FOCAL));
    float pxAngle = 1.0 / (uResolution.y * FOCAL);

    // Långsam kameradrift
    float yaw   = uTime * 0.005;
    float pitch = 0.18 + 0.06 * sin(uTime * 0.013);
    float roll  = 0.25 + 0.03 * sin(uTime * 0.009);
    mat3 cam = rotY(yaw) * rotX(pitch) * rotZ(roll);

    // Parallax: varje lager följer scrollen olika mycket
    mat3 camL1 = rotX(uScroll * 0.00016) * cam;
    mat3 camL2 = rotX(uScroll * 0.00012) * cam;
    mat3 camL3 = rotX(uScroll * 0.00009) * cam;
    mat3 camL4 = rotX(uScroll * 0.00007) * cam;

    // Midnight-mörk himmel, helt utan färgytor
    vec3 midnight = vec3(14.0, 14.0, 15.0) / 255.0;
    vec3 sky = midnight + vec3(0.010, 0.011, 0.014) * galBand(normalize(cam * ray));

    // Stjärnor (färre än tidigare)
    vec3 stars = vec3(0.0);
    stars += starLayer(camL4, ray, 240.0, 0.015, 0.07,  4.0, 0.0, pxAngle, false);
    stars += starLayer(camL3, ray, 100.0, 0.009, 0.06,  3.0, 0.0, pxAngle, true);
    stars += starLayer(camL2, ray,  40.0, 0.012, 0.05,  2.0, 0.6, pxAngle, true);
    stars += starLayer(camL1, ray,  16.0, 0.030, 0.045, 1.0, 1.0, pxAngle, true);
    stars += meteor(p);

    // Tonmappning bara på stjärnorna så himlen behåller sin exakta midnight-ton
    float peak = max(max(stars.r, stars.g), stars.b);
    vec3 mappedStars = stars * ((1.0 - exp(-peak * 1.4)) / max(peak, 0.0001));
    vec3 col = sky + mappedStars;
    col *= 1.0 - 0.30 * dot(p, p);
    col += (hash12(gl_FragCoord.xy) - 0.5) * (1.5 / 255.0);

    vec3 finalColor = mix(clamp(col, 0.0, 1.0), midnight, clamp(uDarkness, 0.0, 1.0));
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;