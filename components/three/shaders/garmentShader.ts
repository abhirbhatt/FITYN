import * as THREE from 'three';

export interface GarmentShaderUniforms {
  [key: string]: THREE.IUniform<any>;
  uFrontTex: { value: THREE.Texture | null };
  uBackTex: { value: THREE.Texture | null };
  uNextFrontTex: { value: THREE.Texture | null };
  uNextBackTex: { value: THREE.Texture | null };
  uWipeProgress: { value: number };
  uTime: { value: number };
  uPhase: { value: number };
  uSwayAmplitude: { value: number };
  uMipBias: { value: number };
  uAlphaTest: { value: number };
}

export const GarmentVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  uniform float uSwayAmplitude;

  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    vec3 transformed = position;
    
    // Pinned at top (uv.y = 1.0 is pinned, hem at uv.y = 0.0 sways)
    float weight = clamp((1.0 - uv.y), 0.0, 1.0);
    float swayWeight = weight * weight;
    
    // Multi-frequency wind oscillation
    float waveZ = sin(uTime * 2.1 + uPhase + position.x * 0.4);
    float waveX = cos(uTime * 1.5 + uPhase * 1.2);
    
    transformed.z += waveZ * uSwayAmplitude * swayWeight;
    transformed.x += waveX * (uSwayAmplitude * 0.3) * swayWeight;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

export const GarmentFragmentShader = /* glsl */ `
  #ifdef GL_ES
  precision highp float;
  #endif

  uniform sampler2D uFrontTex;
  uniform sampler2D uBackTex;
  uniform sampler2D uNextFrontTex;
  uniform sampler2D uNextBackTex;
  uniform float uWipeProgress;
  uniform float uMipBias;
  uniform float uAlphaTest;

  varying vec2 vUv;

  void main() {
    // Front/Back texture mapping via gl_FrontFacing with zero bleed
    vec2 uvCoord = gl_FrontFacing ? vUv : vec2(1.0 - vUv.x, vUv.y);
    
    // Sample using hardware texture mip-bias for instant zero-pass bokeh DoF
    vec4 currentCol = gl_FrontFacing 
      ? texture2D(uFrontTex, uvCoord, uMipBias) 
      : texture2D(uBackTex, uvCoord, uMipBias);
      
    vec4 nextCol = gl_FrontFacing 
      ? texture2D(uNextFrontTex, uvCoord, uMipBias) 
      : texture2D(uNextBackTex, uvCoord, uMipBias);

    // Procedural bottom-to-top noise threshold wipe
    float noise = sin(uvCoord.x * 22.0) * 0.035 + cos(uvCoord.y * 30.0) * 0.035;
    float wipeCoord = (1.0 - uvCoord.y) + noise;
    float threshold = uWipeProgress * 1.3 - 0.15;
    float edge = smoothstep(threshold - 0.05, threshold + 0.05, wipeCoord);
    
    vec4 finalCol = mix(nextCol, currentCol, edge);
    
    // Pixel-perfect alpha clipping with full depth-buffer write
    if (finalCol.a < uAlphaTest) {
      discard;
    }
    
    gl_FragColor = finalCol;
  }
`;

export function createGarmentMaterial(
  frontTex: THREE.Texture,
  backTex: THREE.Texture,
  phase: number = 0,
): THREE.ShaderMaterial {
  // Ensure mipmaps are generated for bokeh DoF trick
  frontTex.generateMipmaps = true;
  frontTex.minFilter = THREE.LinearMipmapLinearFilter;
  frontTex.magFilter = THREE.LinearFilter;
  frontTex.needsUpdate = true;

  backTex.generateMipmaps = true;
  backTex.minFilter = THREE.LinearMipmapLinearFilter;
  backTex.magFilter = THREE.LinearFilter;
  backTex.needsUpdate = true;

  const uniforms: GarmentShaderUniforms = {
    uFrontTex: { value: frontTex },
    uBackTex: { value: backTex },
    uNextFrontTex: { value: frontTex },
    uNextBackTex: { value: backTex },
    uWipeProgress: { value: 0.0 },
    uTime: { value: 0.0 },
    uPhase: { value: phase },
    uSwayAmplitude: { value: 0.04 }, // ~1.5 - 2.0 degrees
    uMipBias: { value: 0.0 },
    uAlphaTest: { value: 0.5 },
  };

  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: GarmentVertexShader,
    fragmentShader: GarmentFragmentShader,
    side: THREE.DoubleSide,
    depthWrite: true,
    depthTest: true,
    transparent: false, // Use alphaTest instead of sorted alpha blending
  });
}
