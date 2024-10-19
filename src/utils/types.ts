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
  systemCode: { lang_id: number; code: string }[];
  imports: { lang_id: number; code: string }[];
  metadata: metadata;
  languagestoskip: number[];
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
  data: { id: string };
}
export interface signUpType extends Omit<commonresponse, 'data'> {
  data: { id: string };
}
export interface metadata {
  input_format: string;
  output_format: string;
  judge_input_template: string;
  variables_names: Record<string, string>;
  variables_types: Record<string, string>;
}
export interface inputformat extends Omit<metadata, 'judge_input_temple' | 'output_format'> {}
export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
export interface submission {
  language_id: number;
  stdin: string;
  stdout: string;
  stderr: null | string;
  status: {
    id: number;
    description: string;
  };
  expected_output: string;
}
