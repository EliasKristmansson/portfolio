const COLOR_OPACITY = 0.55;

// Hur många pixlar man scrollar innan sfären täcker hela skärmen
const SCROLL_DISTANCE = 1400;

// Hur långt bort kameran börjar (större = mindre sfär högst upp)
const SPHERE_START_DISTANCE = 3.3;

export const exampleFragment = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uScroll;

  const float PI = 3.14159265;
  const float FOCAL = 0.866;                       // ~60° vertikalt synfält

  const float SCROLL_DISTANCE = ${SCROLL_DISTANCE.toFixed(1)};
  const float SPHERE_START_DISTANCE = ${SPHERE_START_DISTANCE.toFixed(1)};

  // Var sfären sitter på skärmen när den är liten (0,0 = mitten).
  // Positivt y = högre upp. Flyttas mjukt tillbaka till mitten medan den växer.
  const vec2 SPHERE_CENTER = vec2(0.55, -0.1);

  // Vintergatans plan (normal) – används bara för att samla stjärnor i ett band
  const vec3 GAL_N = vec3(0.4444, 0.8889, 0.1111);

  // ---------- Hash ----------

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

  // ---------- Temafärger ----------
  // Tre-vägs cyklisk blandning blå -> rosa -> orange.

  vec3 cycTint(float wave) {
    float wBlue   = pow(max(cos(wave), 0.0), 2.0);
    float wPink   = pow(max(cos(wave - 2.09439), 0.0), 2.0);
    float wOrange = pow(max(cos(wave - 4.18879), 0.0), 2.0);
    float wSum = wBlue + wPink + wOrange + 0.0001;

    vec3 vividBlue   = vec3(0.039216, 0.709804, 1.0);
    vec3 vividPink   = vec3(1.0, 0.478431, 0.607843);
    vec3 vividOrange = vec3(1.0, 0.498039, 0.090196);

    return (vividBlue * wBlue + vividPink * wPink + vividOrange * wOrange) / wSum;
  }

  vec3 starTint(float t) {
    vec3 tint = cycTint(t * 6.28318 + uScroll * 0.0004);
    return mix(vec3(1.0, 0.97, 0.94), tint, ${COLOR_OPACITY.toFixed(3)} * 1.4);
  }

  // ---------- Stjärnlager ----------
  // Stjärnor ligger i en 3D-cellrymd och projiceras på sfären.
  // "ray" är en punkt på enhetssfären i kamerans system.
  // pxAngle = hur stor en pixel är på sfärens yta (i radianer).
  //
  // screenLight = true (de stora stjärnorna): stjärnans MITTPUNKT ligger fast
  // på sfärens yta, men ljuset (kärna, glöd och strålar) ritas i skärmplanet
  // runt mittpunktens projicerade position – helt oberoende av sfärens
  // geometri. Strålarna går bara i skärmens x- och y-led.

  vec3 starLayer(mat3 cam, vec3 ray, vec3 ro, vec2 pc, float scale, float density,
                 float size, float seed, float spikeAmt, float pxAngle,
                 bool big, bool screenLight) {
    float pxCell = pxAngle * scale;

    // När en cell blir mindre än några pixlar går lagret inte att
    // upplösa (t.ex. när sfären är liten) – tona ut det.
    float layerFade = 1.0 - smoothstep(0.4, 0.7, pxCell);
    if (layerFade <= 0.0) return vec3(0.0);

    vec3 dir   = normalize(cam * ray);
    vec3 right = cam[0];
    vec3 up    = cam[1];

    // Hur snett kameran ser på ytan här (begränsar hur långt ljuset når)
    vec3 rdv  = normalize(ray - ro);
    float cosV = max(abs(dot(ray, rdv)), 0.3);
    float pxS = 1.0 / uResolution.y;

    float band = galBand(dir);
    float dens = clamp(density * (1.0 + 1.5 * band), 0.0, 1.0);

    vec3 c   = vec3(seed * 13.37);
    vec3 p   = dir * scale + c;
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

          float mag = pow(h.y, 3.0);
          float amp = (0.25 + 2.2 * mag);
          float tw  = 0.82 + 0.18 * sin(uTime * (1.2 + 3.0 * h2.x) + h2.y * 60.0);
          vec3 coreCol = starTint(h2.z);

          if (screenLight) {
            // --- Mittpunkten ligger på sfären, ljuset ritas i skärmplanet ---
            vec3 sd = normalize(sp - c);               // stjärnans riktning från sfärens mitt
            vec3 sv = (sd * cam) - ro;                 // till kamerans system, relativt kameran
            float depth = -sv.z;
            if (depth < 0.05) continue;

            vec2 ds = pc - sv.xy / depth * FOCAL;      // pixel relativt stjärnans skärmposition
            float dS = length(ds);
            float cellS = FOCAL / (scale * depth);     // cellens storlek på skärmen

            float wgt = smoothstep(0.6, 0.3, abs(radial))
                      * smoothstep(0.75, 0.35, dS / (cellS * cosV));
            if (wgt <= 0.0) continue;

            float rBase = size * (0.35 + 0.65 * mag) * cellS;
            float r = max(rBase, pxS * 0.8);           // aldrig under ~1 pixel
            float energy = mix(0.35, 1.0, clamp(rBase / r, 0.0, 1.0));

            // Rund kärna + glöd: ju större stjärna, desto svagare (så den inte blir en vit klump)
            float soft = 1.0 - 0.5 * mag;
            float core = exp(-(dS * dS) / (r * r)) * soft;
            float halo = exp(-dS / (r * 3.0)) * (0.02 + 0.15 * mag) * soft;

            // Strålar bara i skärmens x- och y-led
            float L  = cellS * (0.05 + 0.16 * mag);    // strålarnas längd (kortare)
            float th = max(r * 0.4, pxS * 0.6);        // strålarnas tjocklek (tunnare)
            float ax = abs(ds.x);
            float ay = abs(ds.y);
            float sH = exp(-ay / th) * exp(-ax / L);
            float sV = exp(-ax / th) * exp(-ay / L);
            float wide = (exp(-ay / (th * 4.0)) * exp(-ax / (L * 1.6))
                        + exp(-ax / (th * 4.0)) * exp(-ay / (L * 1.6))) * 0.10;
            float streak = ((sH + sV) * 0.5 + wide) * mag * spikeAmt * 1.4;

            vec3 streakCol = mix(coreCol, cycTint(h2.z * 6.28318 + uScroll * 0.0004), 0.5);

            acc += (coreCol * (core + halo) + streakCol * streak) * amp * energy * tw * wgt;
          } else {
            // --- Lager för små stjärnor: ljuset följer sfärens yta som förut ---
            vec3 d3 = rel - dir * radial;
            float dist = length(d3);

            float wgt = 1.0;
            if (big) {
              wgt = smoothstep(0.6, 0.3, abs(radial)) * smoothstep(0.4, 0.15, dist);
            }
            if (wgt <= 0.0) continue;

            float rBase = size * (0.35 + 0.65 * mag);
            float r = max(rBase, pxCell * 0.8);
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

            acc += coreCol * s * amp * energy * tw * wgt;
          }
        }
      }
    }
    return acc * layerFade;
  }

  vec3 starStack(vec3 hit, vec3 ro, vec2 pc, float pxA,
                 mat3 c1, mat3 c2, mat3 c3, mat3 c4) {
    vec3 s = vec3(0.0);
    s += starLayer(c4, hit, ro, pc, 240.0, 0.025, 0.07,  4.0, 0.0, pxA, false, false);
    s += starLayer(c3, hit, ro, pc, 100.0, 0.014, 0.06,  3.0, 0.0, pxA, true,  false);
    s += starLayer(c2, hit, ro, pc,  40.0, 0.012, 0.05,  2.0, 0.6, pxA, true,  true);
    s += starLayer(c1, hit, ro, pc,  10.0, 0.12, 0.03,  1.0, 1.0, pxA, true,  true);
    return s;
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
    float pxAngle = 1.0 / (uResolution.y * FOCAL);

    // Långsam rotation av sfären
    float yaw   = uTime * 0.005;
    float pitch = 0.18 + 0.06 * sin(uTime * 0.013);
    float roll  = 0.25 + 0.03 * sin(uTime * 0.009);
    mat3 cam = rotY(yaw) * rotX(pitch) * rotZ(roll);

    // Parallax: varje lager följer scrollen olika mycket
    mat3 camL1 = rotX(uScroll * 0.00016) * cam;
    mat3 camL2 = rotX(uScroll * 0.00012) * cam;
    mat3 camL3 = rotX(uScroll * 0.00009) * cam;
    mat3 camL4 = rotX(uScroll * 0.00007) * cam;

    vec3 midnight = vec3(14.0, 14.0, 15.0) / 255.0;

    // ----- Scroll -> kameran flyger in mot sfärens mitt -----
    // s = 0 högst upp (liten sfär långt bort), s = 1 = kameran i mitten
    // av sfären och hela skärmen täcks av stjärnhimlen.
    float s = clamp(uScroll / SCROLL_DISTANCE, 0.0, 1.0);
    float d = SPHERE_START_DISTANCE * pow(1.0 - s, 1.5);

    vec2 pc = p - SPHERE_CENTER * (1.0 - s);
    vec3 rd = normalize(vec3(pc, -FOCAL));
    vec3 ro = vec3(0.0, 0.0, d);

    // Stråle mot enhetssfären
    float b      = dot(ro, rd);
    float cc     = dot(ro, ro) - 1.0;               // > 0: kameran utanför
    float disc   = b * b - cc;
    float impact = sqrt(max(dot(ro, ro) - b * b, 0.0));

    // Sfärens närsida tonas ut precis innan kameran passerar ytan,
    // så det aldrig blir ett hopp när man flyger in.
    float nearW = smoothstep(1.0, 1.5, d);

    vec3 stars = vec3(0.0);
    vec3 body  = vec3(0.0);
    vec3 glow  = vec3(0.0);
    float glowK = ${COLOR_OPACITY.toFixed(3)} * 2.0;

    if (disc > 0.0) {
      float sq = sqrt(disc);

      float edge = 1.0;                              // mjuk, antialiasad kant
      if (cc > 0.0) {
        edge = clamp((1.0 - impact) / (pxAngle * d * 1.5 + 0.0001), 0.0, 1.0);
      }

      // Baksidan (det man ser inifrån, eller genom sfären utifrån)
      float tFar = -b + sq;
      if (tFar > 0.0) {
        vec3 hf = ro + rd * tFar;
        float cosF = max(abs(dot(hf, rd)), 0.15);
        float pxF = pxAngle * tFar / cosF;
        float farW = mix(1.0, 0.45, nearW);
        stars += starStack(hf, ro, pc, pxF, camL1, camL2, camL3, camL4) * farW * edge;
        body  += vec3(0.010, 0.011, 0.014) * galBand(normalize(cam * hf)) * edge;
      }

      // Framsidan (bara när kameran är utanför)
      if (cc > 0.0 && nearW > 0.001) {
        float tNear = -b - sq;
        vec3 hn = ro + rd * tNear;
        float cosN = max(dot(hn, -rd), 0.0);
        float pxN = pxAngle * tNear / max(cosN, 0.15);

        stars += starStack(hn, ro, pc, pxN, camL1, camL2, camL3, camL4) * nearW * edge;

        // Svag kantglöd i temafärgerna + en aning kropp så sfären syns mot bakgrunden
        float rim = pow(1.0 - cosN, 3.0);
        vec3 rimCol = cycTint(atan(hn.x, hn.y + 0.0001) + uTime * 0.05);
        glow += rimCol * rim * 0.16 * glowK * nearW * edge;
        body += vec3(0.006, 0.007, 0.010) * (0.5 + rim) * nearW * edge;
      }
    }

    // Atmosfär utanför sfärens silhuett
    if (cc > 0.0 && impact >= 1.0) {
      vec3 atmCol = cycTint(atan(pc.y, pc.x + 0.0001) + uTime * 0.05);
      glow += atmCol * exp(-(impact - 1.0) * 2.5) * 0.12 * glowK * nearW;
    }

    // Meteorer dyker upp när sfären har vuxit
    stars += meteor(p) * smoothstep(0.4, 0.8, s);

    // Tonmappning på ljusstyrkan så färgerna inte bleks till vitt
    float peak = max(max(stars.r, stars.g), stars.b);
    vec3 mappedStars = stars * ((1.0 - exp(-peak * 1.4)) / max(peak, 0.0001));

    vec3 col = midnight + body + mappedStars + glow;
    col *= 1.0 - 0.30 * dot(p, p);
    col += (hash12(gl_FragCoord.xy) - 0.5) * (1.5 / 255.0);

    gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
  }
`;