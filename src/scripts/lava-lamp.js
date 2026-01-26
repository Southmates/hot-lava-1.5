// Lava Lamp Effect with WebGL
export function initLavaLamp() {
  const canvas = document.getElementById('lava-lamp-canvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    console.error('WebGL not supported');
    return;
  }

  // Detect if device is touch-enabled (mobile/tablet)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Vertex shader
  const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      v_uv = a_position * 0.5 + 0.5;
    }
  `;

  // Fragment shader - Optimized: no trail for touch devices
  const fragmentShaderSource = isTouchDevice ? `
    precision highp float;
    
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    
    varying vec2 v_uv;
    
    // Smooth minimum function for metaballs
    float smin(float a, float b, float k) {
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }
    
    // Distance function for a blob
    float blob(vec2 pos, vec2 center, float radius) {
      return length(pos - center) - radius;
    }
    
    void main() {
      vec2 uv = v_uv;
      vec2 p = uv * u_resolution;
      
      // Normalize coordinates
      vec2 center = u_resolution * 0.5;
      vec2 mouse = u_mouse;
      
      // Time-based animation
      float t = u_time * 0.3;
      
      // Create more blobs with organic movement for richer effect
      vec2 baseBlob1 = center + vec2(
        sin(t * 0.7) * 180.0 + cos(t * 0.5) * 120.0,
        cos(t * 0.8) * 150.0 + sin(t * 0.6) * 100.0
      );
      
      vec2 baseBlob2 = center + vec2(
        cos(t * 0.9) * 200.0 + sin(t * 0.4) * 110.0,
        sin(t * 0.7) * 170.0 + cos(t * 0.5) * 90.0
      );
      
      vec2 baseBlob3 = center + vec2(
        sin(t * 0.6) * 220.0 + cos(t * 0.8) * 130.0,
        cos(t * 0.9) * 190.0 + sin(t * 0.3) * 120.0
      );
      
      vec2 baseBlob4 = center + vec2(
        cos(t * 0.5) * 190.0 + sin(t * 0.7) * 115.0,
        sin(t * 0.8) * 160.0 + cos(t * 0.6) * 105.0
      );
      
      vec2 baseBlob5 = center + vec2(
        sin(t * 0.4) * 170.0 + cos(t * 0.6) * 125.0,
        cos(t * 0.5) * 140.0 + sin(t * 0.9) * 95.0
      );
      
      vec2 baseBlob6 = center + vec2(
        cos(t * 0.8) * 210.0 + sin(t * 0.3) * 135.0,
        sin(t * 0.4) * 180.0 + cos(t * 0.7) * 115.0
      );
      
      // Mouse influence on blobs - attract effect
      vec2 mouseInfluence = vec2(0.0);
      float mouseInfluenceStrength = 0.0;
      
      // Initialize blob positions
      vec2 blob1 = baseBlob1;
      vec2 blob2 = baseBlob2;
      vec2 blob3 = baseBlob3;
      vec2 blob4 = baseBlob4;
      vec2 blob5 = baseBlob5;
      vec2 blob6 = baseBlob6;
      
      if (length(mouse) > 0.0) {
        // Calculate mouse influence based on distance to each blob
        // The closer the mouse, the stronger the influence
        float influenceRadius = 300.0;
        
        float mouseDist1 = length(mouse - baseBlob1);
        float mouseDist2 = length(mouse - baseBlob2);
        float mouseDist3 = length(mouse - baseBlob3);
        float mouseDist4 = length(mouse - baseBlob4);
        float mouseDist5 = length(mouse - baseBlob5);
        float mouseDist6 = length(mouse - baseBlob6);
        
        // Apply mouse influence to each blob position
        // Blobs are attracted to mouse when close
        float influence1 = max(0.0, 1.0 - mouseDist1 / influenceRadius);
        float influence2 = max(0.0, 1.0 - mouseDist2 / influenceRadius);
        float influence3 = max(0.0, 1.0 - mouseDist3 / influenceRadius);
        float influence4 = max(0.0, 1.0 - mouseDist4 / influenceRadius);
        float influence5 = max(0.0, 1.0 - mouseDist5 / influenceRadius);
        float influence6 = max(0.0, 1.0 - mouseDist6 / influenceRadius);
        
        // Calculate direction from blob to mouse and apply influence
        if (mouseDist1 > 0.01) {
          vec2 dir1 = normalize(mouse - baseBlob1) * influence1 * 80.0;
          blob1 = baseBlob1 + dir1;
        }
        if (mouseDist2 > 0.01) {
          vec2 dir2 = normalize(mouse - baseBlob2) * influence2 * 80.0;
          blob2 = baseBlob2 + dir2;
        }
        if (mouseDist3 > 0.01) {
          vec2 dir3 = normalize(mouse - baseBlob3) * influence3 * 80.0;
          blob3 = baseBlob3 + dir3;
        }
        if (mouseDist4 > 0.01) {
          vec2 dir4 = normalize(mouse - baseBlob4) * influence4 * 80.0;
          blob4 = baseBlob4 + dir4;
        }
        if (mouseDist5 > 0.01) {
          vec2 dir5 = normalize(mouse - baseBlob5) * influence5 * 80.0;
          blob5 = baseBlob5 + dir5;
        }
        if (mouseDist6 > 0.01) {
          vec2 dir6 = normalize(mouse - baseBlob6) * influence6 * 80.0;
          blob6 = baseBlob6 + dir6;
        }
        
        // Calculate overall mouse influence for color effects
        mouseInfluence = mouse - p;
        mouseInfluenceStrength = exp(-length(mouseInfluence) * 0.003) * 0.5;
      }
      
      // Calculate distances to each blob with varying sizes
      float d1 = blob(p, blob1, 140.0 + sin(t * 0.5) * 40.0);
      float d2 = blob(p, blob2, 120.0 + cos(t * 0.6) * 35.0);
      float d3 = blob(p, blob3, 130.0 + sin(t * 0.7) * 45.0);
      float d4 = blob(p, blob4, 115.0 + cos(t * 0.8) * 30.0);
      float d5 = blob(p, blob5, 125.0 + sin(t * 0.4) * 38.0);
      float d6 = blob(p, blob6, 135.0 + cos(t * 0.9) * 42.0);
      
      // Combine all blobs using smooth minimum for metaball effect
      float k = 55.0; // Smoothness factor
      float dist = smin(smin(smin(smin(smin(d1, d2, k), d3, k), d4, k), d5, k), d6, k);
      
      // Create the lava lamp shape with smooth edges
      float shape = smoothstep(0.0, 35.0, -dist);
      
      // Enhanced orange color palette - more vibrant
      vec3 color1 = vec3(1.0, 0.35, 0.0);      // Bright orange-red
      vec3 color2 = vec3(1.0, 0.55, 0.15);     // Light orange
      vec3 color3 = vec3(0.95, 0.25, 0.0);     // Deep orange
      vec3 color4 = vec3(1.0, 0.65, 0.25);     // Soft orange
      vec3 color5 = vec3(1.0, 0.45, 0.1);      // Medium orange
      vec3 color6 = vec3(0.9, 0.2, 0.0);       // Dark orange
      
      // More complex color mixing for richer visuals
      float colorMix1 = sin(uv.x * 4.0 + t * 1.2) * 0.5 + 0.5;
      float colorMix2 = cos(uv.y * 3.5 + t * 0.9) * 0.5 + 0.5;
      float colorMix3 = sin((uv.x + uv.y) * 3.0 + t * 0.7) * 0.5 + 0.5;
      float colorMix4 = cos((uv.x - uv.y) * 2.5 + t * 1.1) * 0.5 + 0.5;
      
      vec3 color = mix(color1, color2, colorMix1);
      color = mix(color, color3, colorMix2 * 0.6);
      color = mix(color, color4, colorMix3 * 0.4);
      color = mix(color, color5, colorMix4 * 0.3);
      color = mix(color, color6, (1.0 - colorMix1) * 0.2);
      
      // Enhanced depth with gradient based on distance
      float depth = 1.0 - smoothstep(-60.0, 60.0, dist);
      float depthIntensity = 0.6 + depth * 0.5;
      color *= depthIntensity;
      
      // Enhanced glow effect with multiple layers
      float glow1 = exp(-abs(dist) * 0.015) * 0.5;
      float glow2 = exp(-abs(dist) * 0.03) * 0.3;
      float glow3 = exp(-abs(dist) * 0.05) * 0.2;
      
      color += vec3(1.0, 0.5, 0.15) * glow1;
      color += vec3(1.0, 0.6, 0.2) * glow2;
      color += vec3(1.0, 0.4, 0.1) * glow3;
      
      // Add specular highlights for more richness
      float highlight = pow(max(0.0, 1.0 - abs(dist) * 0.01), 8.0);
      color += vec3(1.0, 0.7, 0.3) * highlight * 0.4;
      
      // Add rim lighting effect
      float rim = pow(1.0 - smoothstep(0.0, 100.0, abs(dist)), 2.0);
      color += vec3(1.0, 0.5, 0.1) * rim * 0.3;
      
      // Mouse influence on color - brighter near mouse
      if (length(mouse) > 0.0) {
        color += vec3(0.1, 0.05, 0.0) * mouseInfluenceStrength;
      }
      
      // Apply shape
      color *= shape;
      
      // Enhanced background with gradient
    //   vec3 bgColor1 = vec3(0.08, 0.03, 0.0);
    //   vec3 bgColor2 = vec3(0.12, 0.06, 0.01);
    //   vec3 bgColor = mix(bgColor1, bgColor2, sin(uv.y + t * 0.2) * 0.5 + 0.5);
      // Black background
        vec3 bgColor = vec3(0.0, 0.0, 0.0);
      color = mix(bgColor, color, shape);
      
      // Add subtle noise for texture
      float noise = fract(sin(dot(uv, vec2(12.9898, 78.233)) + t) * 43758.5453);
      color += vec3(0.02, 0.01, 0.0) * noise;
      
      // Increase overall brightness and saturation
      float luminance = dot(color, vec3(0.299, 0.587, 0.114));
      color = mix(vec3(luminance), color, 1.3); // Increase saturation
      color *= 1.15; // Increase brightness
      
      gl_FragColor = vec4(color, 1.0);
    }
  ` : `
    precision highp float;
    
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;
    uniform vec2 u_mouseTrail[10]; // Array of previous mouse positions
    uniform float u_trailIntensity[10]; // Intensity for each trail point
    
    varying vec2 v_uv;
    
    // Smooth minimum function for metaballs
    float smin(float a, float b, float k) {
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }
    
    // Distance function for a blob
    float blob(vec2 pos, vec2 center, float radius) {
      return length(pos - center) - radius;
    }
    
    void main() {
      vec2 uv = v_uv;
      vec2 p = uv * u_resolution;
      
      // Normalize coordinates
      vec2 center = u_resolution * 0.5;
      vec2 mouse = u_mouse;
      
      // Time-based animation
      float t = u_time * 0.3;
      
      // Create more blobs with organic movement for richer effect
      vec2 baseBlob1 = center + vec2(
        sin(t * 0.7) * 180.0 + cos(t * 0.5) * 120.0,
        cos(t * 0.8) * 150.0 + sin(t * 0.6) * 100.0
      );
      
      vec2 baseBlob2 = center + vec2(
        cos(t * 0.9) * 200.0 + sin(t * 0.4) * 110.0,
        sin(t * 0.7) * 170.0 + cos(t * 0.5) * 90.0
      );
      
      vec2 baseBlob3 = center + vec2(
        sin(t * 0.6) * 220.0 + cos(t * 0.8) * 130.0,
        cos(t * 0.9) * 190.0 + sin(t * 0.3) * 120.0
      );
      
      vec2 baseBlob4 = center + vec2(
        cos(t * 0.5) * 190.0 + sin(t * 0.7) * 115.0,
        sin(t * 0.8) * 160.0 + cos(t * 0.6) * 105.0
      );
      
      vec2 baseBlob5 = center + vec2(
        sin(t * 0.4) * 170.0 + cos(t * 0.6) * 125.0,
        cos(t * 0.5) * 140.0 + sin(t * 0.9) * 95.0
      );
      
      vec2 baseBlob6 = center + vec2(
        cos(t * 0.8) * 210.0 + sin(t * 0.3) * 135.0,
        sin(t * 0.4) * 180.0 + cos(t * 0.7) * 115.0
      );
      
      // Mouse influence on blobs - attract effect
      vec2 mouseInfluence = vec2(0.0);
      float mouseInfluenceStrength = 0.0;
      
      // Initialize blob positions
      vec2 blob1 = baseBlob1;
      vec2 blob2 = baseBlob2;
      vec2 blob3 = baseBlob3;
      vec2 blob4 = baseBlob4;
      vec2 blob5 = baseBlob5;
      vec2 blob6 = baseBlob6;
      
      if (length(mouse) > 0.0) {
        // Calculate mouse influence based on distance to each blob
        // The closer the mouse, the stronger the influence
        float influenceRadius = 300.0;
        
        float mouseDist1 = length(mouse - baseBlob1);
        float mouseDist2 = length(mouse - baseBlob2);
        float mouseDist3 = length(mouse - baseBlob3);
        float mouseDist4 = length(mouse - baseBlob4);
        float mouseDist5 = length(mouse - baseBlob5);
        float mouseDist6 = length(mouse - baseBlob6);
        
        // Apply mouse influence to each blob position
        // Blobs are attracted to mouse when close
        float influence1 = max(0.0, 1.0 - mouseDist1 / influenceRadius);
        float influence2 = max(0.0, 1.0 - mouseDist2 / influenceRadius);
        float influence3 = max(0.0, 1.0 - mouseDist3 / influenceRadius);
        float influence4 = max(0.0, 1.0 - mouseDist4 / influenceRadius);
        float influence5 = max(0.0, 1.0 - mouseDist5 / influenceRadius);
        float influence6 = max(0.0, 1.0 - mouseDist6 / influenceRadius);
        
        // Calculate direction from blob to mouse and apply influence
        if (mouseDist1 > 0.01) {
          vec2 dir1 = normalize(mouse - baseBlob1) * influence1 * 80.0;
          blob1 = baseBlob1 + dir1;
        }
        if (mouseDist2 > 0.01) {
          vec2 dir2 = normalize(mouse - baseBlob2) * influence2 * 80.0;
          blob2 = baseBlob2 + dir2;
        }
        if (mouseDist3 > 0.01) {
          vec2 dir3 = normalize(mouse - baseBlob3) * influence3 * 80.0;
          blob3 = baseBlob3 + dir3;
        }
        if (mouseDist4 > 0.01) {
          vec2 dir4 = normalize(mouse - baseBlob4) * influence4 * 80.0;
          blob4 = baseBlob4 + dir4;
        }
        if (mouseDist5 > 0.01) {
          vec2 dir5 = normalize(mouse - baseBlob5) * influence5 * 80.0;
          blob5 = baseBlob5 + dir5;
        }
        if (mouseDist6 > 0.01) {
          vec2 dir6 = normalize(mouse - baseBlob6) * influence6 * 80.0;
          blob6 = baseBlob6 + dir6;
        }
        
        // Calculate overall mouse influence for color effects
        mouseInfluence = mouse - p;
        mouseInfluenceStrength = exp(-length(mouseInfluence) * 0.003) * 0.5;
      }
      
      // Calculate distances to each blob with varying sizes
      float d1 = blob(p, blob1, 140.0 + sin(t * 0.5) * 40.0);
      float d2 = blob(p, blob2, 120.0 + cos(t * 0.6) * 35.0);
      float d3 = blob(p, blob3, 130.0 + sin(t * 0.7) * 45.0);
      float d4 = blob(p, blob4, 115.0 + cos(t * 0.8) * 30.0);
      float d5 = blob(p, blob5, 125.0 + sin(t * 0.4) * 38.0);
      float d6 = blob(p, blob6, 135.0 + cos(t * 0.9) * 42.0);
      
      // Mouse trail influence on blobs (subtle effect)
      float trailInfluence = 0.0;
      for (int i = 0; i < 10; i++) {
        if (u_trailIntensity[i] > 0.01) {
          float trailDist = length(p - u_mouseTrail[i]);
          float trailEffect = exp(-trailDist * 0.002) * u_trailIntensity[i] * 0.3;
          trailInfluence += trailEffect;
        }
      }
      
      // Combine all blobs using smooth minimum for metaball effect
      float k = 55.0; // Smoothness factor
      float dist = smin(smin(smin(smin(smin(d1, d2, k), d3, k), d4, k), d5, k), d6, k);
      
      // Add subtle trail influence to the distance field
      dist -= trailInfluence * 20.0;
      
      // Create the lava lamp shape with smooth edges
      float shape = smoothstep(0.0, 35.0, -dist);
      
      // Enhanced orange color palette - more vibrant
      vec3 color1 = vec3(1.0, 0.35, 0.0);      // Bright orange-red
      vec3 color2 = vec3(1.0, 0.55, 0.15);     // Light orange
      vec3 color3 = vec3(0.95, 0.25, 0.0);     // Deep orange
      vec3 color4 = vec3(1.0, 0.65, 0.25);     // Soft orange
      vec3 color5 = vec3(1.0, 0.45, 0.1);      // Medium orange
      vec3 color6 = vec3(0.9, 0.2, 0.0);       // Dark orange
      
      // More complex color mixing for richer visuals
      float colorMix1 = sin(uv.x * 4.0 + t * 1.2) * 0.5 + 0.5;
      float colorMix2 = cos(uv.y * 3.5 + t * 0.9) * 0.5 + 0.5;
      float colorMix3 = sin((uv.x + uv.y) * 3.0 + t * 0.7) * 0.5 + 0.5;
      float colorMix4 = cos((uv.x - uv.y) * 2.5 + t * 1.1) * 0.5 + 0.5;
      
      vec3 color = mix(color1, color2, colorMix1);
      color = mix(color, color3, colorMix2 * 0.6);
      color = mix(color, color4, colorMix3 * 0.4);
      color = mix(color, color5, colorMix4 * 0.3);
      color = mix(color, color6, (1.0 - colorMix1) * 0.2);
      
      // Enhanced depth with gradient based on distance
      float depth = 1.0 - smoothstep(-60.0, 60.0, dist);
      float depthIntensity = 0.6 + depth * 0.5;
      color *= depthIntensity;
      
      // Enhanced glow effect with multiple layers
      float glow1 = exp(-abs(dist) * 0.015) * 0.5;
      float glow2 = exp(-abs(dist) * 0.03) * 0.3;
      float glow3 = exp(-abs(dist) * 0.05) * 0.2;
      
      color += vec3(1.0, 0.5, 0.15) * glow1;
      color += vec3(1.0, 0.6, 0.2) * glow2;
      color += vec3(1.0, 0.4, 0.1) * glow3;
      
      // Add specular highlights for more richness
      float highlight = pow(max(0.0, 1.0 - abs(dist) * 0.01), 8.0);
      color += vec3(1.0, 0.7, 0.3) * highlight * 0.4;
      
      // Add rim lighting effect
      float rim = pow(1.0 - smoothstep(0.0, 100.0, abs(dist)), 2.0);
      color += vec3(1.0, 0.5, 0.1) * rim * 0.3;
      
      // Mouse influence on color - brighter near mouse
      if (length(mouse) > 0.0) {
        color += vec3(0.1, 0.05, 0.0) * mouseInfluenceStrength;
      }
      
      // Apply shape
      color *= shape;
      
      // Enhanced background with gradient
    //   vec3 bgColor1 = vec3(0.08, 0.03, 0.0);
    //   vec3 bgColor2 = vec3(0.12, 0.06, 0.01);
    //   vec3 bgColor = mix(bgColor1, bgColor2, sin(uv.y + t * 0.2) * 0.5 + 0.5);
      // Black background
        vec3 bgColor = vec3(0.0, 0.0, 0.0);
      color = mix(bgColor, color, shape);
      
      // Add subtle noise for texture
      float noise = fract(sin(dot(uv, vec2(12.9898, 78.233)) + t) * 43758.5453);
      color += vec3(0.02, 0.01, 0.0) * noise;
      
      // Increase overall brightness and saturation
      float luminance = dot(color, vec3(0.299, 0.587, 0.114));
      color = mix(vec3(luminance), color, 1.3); // Increase saturation
      color *= 1.15; // Increase brightness
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // Compile shader
  function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }

  // Create shader program
  const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
  
  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    return;
  }

  // Create quad that covers the entire screen
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1,
  ]), gl.STATIC_DRAW);

  // Get attribute and uniform locations
  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const timeLocation = gl.getUniformLocation(program, 'u_time');
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
  
  // Get trail uniform locations (arrays need individual element locations)
  const mouseTrailLocations = [];
  const trailIntensityLocations = [];
  for (let i = 0; i < 10; i++) {
    mouseTrailLocations.push(gl.getUniformLocation(program, `u_mouseTrail[${i}]`));
    trailIntensityLocations.push(gl.getUniformLocation(program, `u_trailIntensity[${i}]`));
  }

  // Set up viewport
  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }
  resize();
  window.addEventListener('resize', resize);

  // Mouse tracking with trail system
  let mouseX = 0;
  let mouseY = 0;
  let mouseTrail = [];
  let trailIntensities = [];
  const maxTrailPoints = 10;
  
  // Initialize trail arrays
  for (let i = 0; i < maxTrailPoints; i++) {
    mouseTrail.push({ x: 0, y: 0 });
    trailIntensities.push(0);
  }
  
  canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = canvas.height - e.clientY; // Flip Y coordinate
    
    // Add new position to trail
    mouseTrail.unshift({ x: mouseX, y: mouseY });
    trailIntensities.unshift(1.0); // Full intensity for current position
    
    // Limit trail length
    if (mouseTrail.length > maxTrailPoints) {
      mouseTrail.pop();
      trailIntensities.pop();
    }
    
    // Decay trail intensities
    for (let i = 1; i < trailIntensities.length; i++) {
      trailIntensities[i] *= 0.85; // Decay factor
    }
  });

  canvas.addEventListener('mouseleave', () => {
    mouseX = 0;
    mouseY = 0;
    // Clear trail gradually
    for (let i = 0; i < trailIntensities.length; i++) {
      trailIntensities[i] *= 0.9;
    }
  });

  // Animation loop
  let startTime = Date.now();
  
  function animate() {
    requestAnimationFrame(animate);

    const currentTime = (Date.now() - startTime) / 1000.0;

    // Use the program
    gl.useProgram(program);

    // Set up attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Set uniforms
    gl.uniform1f(timeLocation, currentTime);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform2f(mouseLocation, mouseX, mouseY);
    
    // Set trail uniforms (each element individually)
    for (let i = 0; i < maxTrailPoints; i++) {
      if (i < mouseTrail.length && mouseTrailLocations[i] && trailIntensityLocations[i]) {
        gl.uniform2f(mouseTrailLocations[i], mouseTrail[i].x, mouseTrail[i].y);
        gl.uniform1f(trailIntensityLocations[i], trailIntensities[i]);
      } else if (mouseTrailLocations[i] && trailIntensityLocations[i]) {
        gl.uniform2f(mouseTrailLocations[i], 0, 0);
        gl.uniform1f(trailIntensityLocations[i], 0);
      }
    }

    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    // Continue decaying trail when mouse is not moving
    if (mouseX === 0 && mouseY === 0) {
      for (let i = 0; i < trailIntensities.length; i++) {
        trailIntensities[i] *= 0.95;
      }
    }
  }

  animate();
}

