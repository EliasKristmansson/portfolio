const COLOR_OPACITY = 0.25;

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

  // Bayer 4x4 ordered-dither-matris, normaliserad 0-1.
  float bayerDither(vec2 pixelCoord) {
    int x = int(mod(pixelCoord.x, 4.0));
    int y = int(mod(pixelCoord.y, 4.0));
    int index = x + y * 4;
    float bayer[16];
    bayer[0]=0.0;  bayer[1]=8.0;  bayer[2]=2.0;  bayer[3]=10.0;
    bayer[4]=12.0; bayer[5]=4.0;  bayer[6]=14.0; bayer[7]=6.0;
    bayer[8]=3.0;  bayer[9]=11.0; bayer[10]=1.0; bayer[11]=9.0;
    bayer[12]=15.0; bayer[13]=7.0; bayer[14]=13.0; bayer[15]=5.0;
    return bayer[index] / 16.0;
  }

  void main() {
    float pixelSize = 50.0;
    vec2 pixelatedCoord = floor(gl_FragCoord.xy / pixelSize) * pixelSize;
    vec2 uv = pixelatedCoord / uResolution;

    vec2 aspectCorrected = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);

    float scrollOffset = uScroll * 0.0015;
    vec2 warp = aspectCorrected * 1.3 + vec2(0.0, scrollOffset);
    warp += vec2(noise(warp + uTime * 0.04), noise(warp - uTime * 0.04));
    float n = fbm(warp);

    // Mörka baskulörer, en per färg i cykeln — orange tillagd som en
    // tredje, i samma mörka/dämpade stil som de två ursprungliga.
    vec3 darkBlue   = vec3(0.063, 0.082, 0.110);  // #10151c
    vec3 darkPink   = vec3(0.141, 0.082, 0.114);  // #24151d
    vec3 darkOrange = vec3(0.137, 0.098, 0.055);  // mörk orange-variant

    // Levande varianter, används bara i sheen (samma roll som
    // "sheenColor" hade innan).
    vec3 vividBlue   = vec3(0.145, 0.706, 0.941);  // #25b4f0
    vec3 vividPink   = vec3(0.894, 0.502, 0.596);  // #e48098
    vec3 vividOrange = vec3(0.984, 0.573, 0.235);  // #fb923c

    float colorPhase = n * 2.2 + uScroll * 0.00025;
    float wave = colorPhase * 6.28318;

    // Tre-vägs cyklisk vikt, samma idé som sky->rose->orange-gradienten
    // i din Interaction-hover-effekt: tre cosinus-vågor offsatta 120°
    // (2π/3) från varandra, kvadrerade så bara toppen av varje våg
    // bidrar — resultatet är tre "zoner" som mjukt tar över efter
    // varandra istället för en binär blandning mellan två färger.
    float wBlue   = pow(max(cos(wave), 0.0), 2.0);
    float wPink   = pow(max(cos(wave - 2.09439), 0.0), 2.0);
    float wOrange = pow(max(cos(wave - 4.18879), 0.0), 2.0);
    float wSum = wBlue + wPink + wOrange + 0.0001;

    vec3 base = (darkBlue * wBlue + darkPink * wPink + darkOrange * wOrange) / wSum;
    base *= 0.55 + 0.25 * noise(warp * 0.9 + 3.0);

    // "purity" = hur dominant EN färg är just nu, istället för den
    // gamla binära versionen — peakar när en enda zon täcker nästan
    // hela vikten, sjunker vid övergångarna mellan zonerna.
    float purity = max(max(wBlue, wPink), wOrange) / wSum;
    float texture = noise(warp * 2.6 - scrollOffset * 0.6);
    float sheen = pow(purity, 6.0) * pow(texture, 2.0);

    vec3 sheenColor = (vividBlue * wBlue + vividPink * wPink + vividOrange * wOrange) / wSum * 2.6;

    vec3 color = base + sheen * sheenColor * ${COLOR_OPACITY};

    float levels = 70.0;
    float dither = bayerDither(pixelatedCoord) - 0.5;
    vec3 ditheredColor = color + dither / levels;
    vec3 quantized = floor(ditheredColor * levels) / levels;

    gl_FragColor = vec4(clamp(quantized, 0.0, 1.0), 1.0);
  }
`;