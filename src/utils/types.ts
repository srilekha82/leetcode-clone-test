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
  starterCode: { lang_id: number; code: string }[];
}
export interface commonresponse {
  status: 'Success' | 'Failure';
  error?: string;
  data: any;
}
export interface getProblemsType extends Omit<commonresponse, 'data'> {
  data: Problem[];
}
export interface getProblemType extends Omit<commonresponse, 'data'> {
  data: Problem;
}
export interface User {
  username: string;
  email: string;
  solvedProblems: string[];
  favoriteProgrammingLanguage: string;
  submissions: string[];
  roles: string[];
}
export interface getUserType extends Omit<commonresponse, 'data'> {
  data: User;
}
export interface signInType extends Omit<commonresponse, 'data'> {
  data: { id: string; access_token: string };
}
