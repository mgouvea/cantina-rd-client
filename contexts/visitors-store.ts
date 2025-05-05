import { Visitor } from "@/types";
import { create } from "zustand";

interface VisitorStore {
  visitor: Visitor | null;
  updateVisitor: (visitor: Visitor | null) => void;
}

export const useVisitorStore = create<VisitorStore>((set) => ({
  visitor: null,
  updateVisitor: (visitor) => set({ visitor }),
}));
