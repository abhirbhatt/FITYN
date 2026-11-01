import { create } from 'zustand';

export type QualityTier = 'high' | 'medium' | 'low';

interface QualityState {
  tier: QualityTier;
  maxDpr: number;
  is3DSupported: boolean;
  textureResolution: 1024 | 2048;
  windEnabled: boolean;
  blurEnabled: boolean;
  hangTagsEnabled: boolean;
  reducedMotion: boolean;

  setTier: (tier: QualityTier) => void;
  setReducedMotion: (reduced: boolean) => void;
}

const TIER_CONFIG: Record<
  QualityTier,
  {
    maxDpr: number;
    is3DSupported: boolean;
    textureResolution: 1024 | 2048;
    windEnabled: boolean;
    blurEnabled: boolean;
    hangTagsEnabled: boolean;
  }
> = {
  high: {
    maxDpr: 2.0,
    is3DSupported: true,
    textureResolution: 2048,
    windEnabled: true,
    blurEnabled: true,
    hangTagsEnabled: true,
  },
  medium: {
    maxDpr: 1.25,
    is3DSupported: true,
    textureResolution: 1024,
    windEnabled: true,
    blurEnabled: true,
    hangTagsEnabled: true,
  },
  low: {
    maxDpr: 1.0,
    is3DSupported: false,
    textureResolution: 1024,
    windEnabled: false,
    blurEnabled: false,
    hangTagsEnabled: false,
  },
};

export const useQualityStore = create<QualityState>((set) => ({
  tier: 'high',
  ...TIER_CONFIG.high,
  reducedMotion: false,

  setTier: (tier: QualityTier) => {
    const config = TIER_CONFIG[tier];
    set({
      tier,
      ...config,
    });
  },

  setReducedMotion: (reducedMotion: boolean) => {
    set((state) => ({
      reducedMotion,
      windEnabled: reducedMotion ? false : state.windEnabled,
    }));
  },
}));

