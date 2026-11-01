import { create } from 'zustand';

export type GarmentSide = 'front' | 'back';
export type SceneRouteFocus = 'rail' | 'product' | 'collections' | 'cart' | 'checkout' | 'idle';

interface SceneState {
  activeGarmentIndex: number;
  activeGarmentId: string | null;
  side: GarmentSide;
  colourwayIndex: number;
  routeFocus: SceneRouteFocus;
  totalGarments: number;
  setActiveGarment: (index: number, id?: string | null) => void;
  setSide: (side: GarmentSide) => void;
  toggleSide: () => void;
  setColourway: (index: number) => void;
  setRouteFocus: (focus: SceneRouteFocus) => void;
  nextGarment: () => void;
  prevGarment: () => void;
  resetScene: () => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  activeGarmentIndex: 0,
  activeGarmentId: null,
  side: 'front',
  colourwayIndex: 0,
  routeFocus: 'rail',
  totalGarments: 7,

  setActiveGarment: (index: number, id: string | null = null) =>
    set({
      activeGarmentIndex: Math.max(0, Math.min(6, index)),
      activeGarmentId: id,
      side: 'front',
      colourwayIndex: 0,
    }),

  setSide: (side: GarmentSide) => set({ side }),

  toggleSide: () =>
    set((state) => ({
      side: state.side === 'front' ? 'back' : 'front',
    })),

  setColourway: (colourwayIndex: number) =>
    set({ colourwayIndex: Math.max(0, colourwayIndex) }),

  setRouteFocus: (routeFocus: SceneRouteFocus) => set({ routeFocus }),

  nextGarment: () =>
    set((state) => {
      const next = (state.activeGarmentIndex + 1) % state.totalGarments;
      return {
        activeGarmentIndex: next,
        side: 'front',
        colourwayIndex: 0,
      };
    }),

  prevGarment: () =>
    set((state) => {
      const prev =
        (state.activeGarmentIndex - 1 + state.totalGarments) % state.totalGarments;
      return {
        activeGarmentIndex: prev,
        side: 'front',
        colourwayIndex: 0,
      };
    }),

  resetScene: () =>
    set({
      activeGarmentIndex: 0,
      activeGarmentId: null,
      side: 'front',
      colourwayIndex: 0,
      routeFocus: 'rail',
    }),
}));

