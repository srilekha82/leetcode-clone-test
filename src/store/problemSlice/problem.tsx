import { create } from 'zustand';
import { SavedProblems } from '../../utils/types';

interface ProblemSlice {
  problems: SavedProblems[];
  setProblems: (problems: SavedProblems[]) => void;
}

export const useProblemSlice = create<ProblemSlice>()((set) => ({
  problems: [],
  setProblems: (problems) => set(() => ({ problems })),
}));
