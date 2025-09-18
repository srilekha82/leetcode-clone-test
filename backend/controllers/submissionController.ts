import { Request, Response } from 'express';
import Submission from '../models/Submission';
import User from '../models/User';

export const addSubmission = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ status: 'Failure', error: 'User not found' });
  const submission = new Submission({ ...req.body, user: user._id });
  await submission.save();
  user.submissions.push(submission._id);
  await user.save();
  res.json({ status: 'Success', submission });
};

export const getSubmission = async (req: Request, res: Response) => {
  const submission = await Submission.findById(req.params.id);
  if (!submission) return res.status(404).json({ status: 'Failure', error: 'Submission not found' });
  res.json({ status: 'Success', submission });
};

export const createSubmission = async (req: Request, res: Response) => {
  const submission = new Submission(req.body);
  await submission.save();
  res.json({ status: 'Success', submission });
};

export const batchwiseSubmission = async (req: Request, res: Response) => {
  const batch = await Submission.insertMany(req.body.submissions);
  res.json({ status: 'Success', batch });
};

export const updateSubmission = async (req: Request, res: Response) => {
  const { id, update } = req.body;
  const submission = await Submission.findByIdAndUpdate(id, update, { new: true });
  if (!submission) return res.status(404).json({ status: 'Failure', error: 'Submission not found' });
  res.json({ status: 'Success', submission });
};
