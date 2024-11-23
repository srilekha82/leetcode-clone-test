import { create } from 'zustand';

interface ProblemSlice {
  problems: string[];
  setProblems: (problems: string[]) => void;
}

export const useProblemSlice = create<ProblemSlice>()((set) => ({
  problems: [],
  setProblems: (problems) => set(() => ({ problems })),
}));
