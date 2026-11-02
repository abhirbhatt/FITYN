/**
 * Centralized Reference Design & Spatial Tokens
 * Reverse-engineered from reference video (SNUG WRLD interactive hanging rail experience)
 * and mapped strictly into FITYN design system.
 */

export const REFERENCE_TOKENS = {
  // Viewport & Rail Positioning
  rail: {
    barHeightPercent: 0.30, // ~28-32% of viewport height from top
    garmentBottomPercent: 0.60, // ~58-62% height from top
    spacing: 2.18, // Three.js units between garments on the rail
    visibleCountDesktop: 7,
    visibleCountMobile: 3,
    activeScale: 1.25, // Active garment scale in rail mode
    inactiveScale: 0.94, // Inactive garment scale in rail mode
    inactiveDim: 0.60, // Inactive garment dimming factor (spotlight effect)
    inactiveBlurMipBias: 2.8, // Mip bias bokeh blur on inactive neighbours
    damping: 0.88, // Horizontal trackpad/drag inertia damping factor
    snapSpeed: 6.0, // Lerp speed to snap to nearest garment
  },

  // Focus Mode Experience
  focus: {
    enterDurationMs: 1100, // 1.0 - 1.4s smooth camera/garment scale transition
    exitDurationMs: 800,
    garmentScale: 1.45, // Scales to 40-45% of viewport height
    cameraZ: 3.25, // Close-up camera Z distance in focus mode
    cameraY: -0.05, // Slightly lower to center large garment
    inactiveOpacity: 0.45,
    inactiveBlurMipBias: 3.6,
    inactiveDim: 0.35,
    tagOffsetX: 0.58, // Distance of hang tag to right of active garment
    tagOffsetY: 0.22,
  },

  // Animation Timings
  timing: {
    flipDurationSec: 0.72, // 0.5 - 1.0s Y-axis rotation (0 to PI)
    colourSwapDurationSec: 0.40, // 0.3 - 0.5s texture cross-fade / wipe
    idleSwayAmplitude: 0.038, // Subtle ambient wind sway
  },

  // Camera Settings
  camera: {
    fov: 26.0, // Low FOV for quasi-orthographic architectural feel with subtle perspective depth
    defaultZ: 4.3,
    defaultY: -0.02,
    defaultX: 0.0,
  },

  // Colors & Aesthetic Tokens
  colors: {
    bgLight: '#F3F3F0',
    bgMuted: '#E9E9E4',
    bgBorder: '#D4D4CE',
    black: '#0A0A0A',
    olive: '#486C2F',
    butter: '#FFF2B4',
    white: '#FFFFFF',
    // Commented alternative per specification rule 2: neon green '#39FF14'
    tickerBg: 'var(--ticker-bg, #486C2F)',
    tickerText: '#F3F3F0',
  },
} as const;
