import { create } from "zustand";
import { getPoint } from "../api/users";

interface PointState {
  point: number;
  isLoading: boolean;
  fetchPoint: () => Promise<void>;
}

export const usePointStore = create<PointState>((set) => ({
  point: 0,
  isLoading: true,
  fetchPoint: async () => {
    try {
      set({ isLoading: true });
      const data = await getPoint();
      set({ point: data.amount, isLoading: false });
    } catch (error) {
      console.error("포인트 로딩 실패:", error);
      set({ isLoading: false });
    }
  },
}));
