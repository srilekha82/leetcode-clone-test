import { Request, Response } from 'express';
import User from '../models/User';

export const getUser = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ status: 'Failure', error: 'User not found' });
  res.json({ status: 'Success', user });
};
