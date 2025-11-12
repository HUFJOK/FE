import { create } from "zustand";
import { getPoint } from "../api/users";

interface PointState {
  point: number;
  isPointLoading: boolean;
  fetchPoint: () => Promise<void>;
}

export const usePointStore = create<PointState>((set) => ({
  point: 0,
  isPointLoading: true,
  fetchPoint: async () => {
    try {
      set({ isPointLoading: true });
      const data = await getPoint();
      set({ point: data.amount, isPointLoading: false });
    } catch (error) {
      console.error("포인트 로딩 실패:", error);
      set({ isPointLoading: false });
    }
  },
}));
