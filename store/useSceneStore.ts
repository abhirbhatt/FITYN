import { create } from 'zustand';

export type GarmentSide = 'front' | 'back';
export type SceneRouteFocus =
  | 'rail'
  | 'product'
  | 'collections'
  | 'cart'
  | 'checkout'
  | 'idle';

export type ViewMode = 'rail' | 'focus';

interface SceneState {
  activeGarmentIndex: number;
  activeGarmentId: string | null;
  side: GarmentSide;
  colourwayIndex: number;
  garmentColourways: Record<number, number>;
  routeFocus: SceneRouteFocus;
  viewMode: ViewMode;
  totalGarments: number;
  setActiveGarment: (index: number, id?: string | null) => void;
  setSide: (side: GarmentSide) => void;
  toggleSide: () => void;
  setColourway: (index: number) => void;
  setGarmentColourway: (garmentIndex: number, colourwayIndex: number) => void;
  getGarmentColourway: (garmentIndex: number) => number;
  setRouteFocus: (focus: SceneRouteFocus) => void;
  setViewMode: (mode: ViewMode) => void;
  enterFocus: () => void;
  exitFocus: () => void;
  nextGarment: () => void;
  prevGarment: () => void;
  resetScene: () => void;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  activeGarmentIndex: 0,
  activeGarmentId: null,
  side: 'front',
  colourwayIndex: 0,
  garmentColourways: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  routeFocus: 'rail',
  viewMode: 'rail',
  totalGarments: 7,

  setActiveGarment: (index: number, id: string | null = null) => {
    const validIdx = Math.max(0, Math.min(6, index));
    const activeColourway = get().garmentColourways[validIdx] ?? 0;
    set({
      activeGarmentIndex: validIdx,
      activeGarmentId: id,
      side: 'front',
      colourwayIndex: activeColourway,
    });
  },

  setSide: (side: GarmentSide) => set({ side }),

  toggleSide: () =>
    set((state) => ({
      side: state.side === 'front' ? 'back' : 'front',
    })),

  setColourway: (colourwayIndex: number) =>
    set((state) => {
      const validColourway = Math.max(0, colourwayIndex);
      return {
        colourwayIndex: validColourway,
        garmentColourways: {
          ...state.garmentColourways,
          [state.activeGarmentIndex]: validColourway,
        },
      };
    }),

  setGarmentColourway: (garmentIndex: number, colourwayIndex: number) =>
    set((state) => {
      const validColourway = Math.max(0, colourwayIndex);
      const isCurrentActive = state.activeGarmentIndex === garmentIndex;
      return {
        ...(isCurrentActive ? { colourwayIndex: validColourway } : {}),
        garmentColourways: {
          ...state.garmentColourways,
          [garmentIndex]: validColourway,
        },
      };
    }),

  getGarmentColourway: (garmentIndex: number) => {
    return get().garmentColourways[garmentIndex] ?? 0;
  },

  setRouteFocus: (routeFocus: SceneRouteFocus) => {
    set({
      routeFocus,
      // If navigating to another route, reset viewMode to rail
      viewMode: 'rail',
    });
  },

  setViewMode: (viewMode: ViewMode) => set({ viewMode }),

  enterFocus: () => set({ viewMode: 'focus' }),

  exitFocus: () => set({ viewMode: 'rail' }),

  nextGarment: () =>
    set((state) => {
      const next = (state.activeGarmentIndex + 1) % state.totalGarments;
      return {
        activeGarmentIndex: next,
        side: 'front',
        colourwayIndex: state.garmentColourways[next] ?? 0,
      };
    }),

  prevGarment: () =>
    set((state) => {
      const prev =
        (state.activeGarmentIndex - 1 + state.totalGarments) %
        state.totalGarments;
      return {
        activeGarmentIndex: prev,
        side: 'front',
        colourwayIndex: state.garmentColourways[prev] ?? 0,
      };
    }),

  resetScene: () =>
    set({
      activeGarmentIndex: 0,
      activeGarmentId: null,
      side: 'front',
      colourwayIndex: 0,
      viewMode: 'rail',
      garmentColourways: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    }),
}));
