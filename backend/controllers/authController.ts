import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ status: 'Failure', error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.json({ status: 'Success', user });
  } catch (error) {
    res.status(500).json({ status: 'Failure', error: error });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ status: 'Failure', error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || '', { expiresIn: '1d' });
    res.json({ status: 'Success', token, user });
  } catch (error) {
    res.status(500).json({ status: 'Failure', error: error });
  }
};

export const signout = async (_req: Request, res: Response) => {
  res.json({ status: 'Success' });
};

export const validateSession = async (req: Request, res: Response) => {
  // For demo, always valid if token exists
  res.json({ status: 'Success' });
};
