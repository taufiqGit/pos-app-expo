import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Outlet } from "../services/outletService";

export interface OutletState {
  selectedOutlet: Outlet | null;
  hasHydrated: boolean;

  setSelectedOutlet: (outlet: Outlet) => void;
  clearSelectedOutlet: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

const DEFAULT_STATE: Omit<
  OutletState,
  "setSelectedOutlet" | "clearSelectedOutlet" | "setHasHydrated"
> = {
  selectedOutlet: null,
  hasHydrated: false,
};

export const useOutletStore = create<OutletState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setSelectedOutlet: (selectedOutlet) => set({ selectedOutlet }),
      clearSelectedOutlet: () => set({ selectedOutlet: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "pos-outlet-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
