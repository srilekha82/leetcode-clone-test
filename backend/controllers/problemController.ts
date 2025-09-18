import { Request, Response } from 'express';
import Problem from '../models/Problem';

export const getProblems = async (_req: Request, res: Response) => {
  const problems = await Problem.find();
  res.json({ status: 'Success', problems });
};

export const getProblem = async (req: Request, res: Response) => {
  const problem = await Problem.findById(req.params.id);
  if (!problem) return res.status(404).json({ status: 'Failure', error: 'Problem not found' });
  res.json({ status: 'Success', problem });
};

export const createProblem = async (req: Request, res: Response) => {
  const { title, description, difficulty } = req.body;
  const problem = new Problem({ title, description, difficulty });
  await problem.save();
  res.json({ status: 'Success', problem });
};
