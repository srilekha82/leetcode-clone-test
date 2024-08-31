import { ReactNode } from 'react';

export interface themeContext {
  toggleColorMode: () => void;
  colorMode: 'light' | 'dark';
}

export interface contextWrapperProps {
  children: ReactNode;
}
export interface Problem {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sampleInput: string;
  sampleOutput: string;
  testCases: { input: string; output: string }[];
  status: string;
  _id: string;
}
export interface commonresponse {
  status: 'Sucess' | 'Failure';
  error?: string;
  data: any;
}
export interface getProblemsType extends Omit<commonresponse, 'data'> {
  data: Problem[];
}
export interface getProblemType extends Omit<commonresponse, 'data'> {
  data: Problem;
}
