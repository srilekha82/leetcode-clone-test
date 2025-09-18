import mongoose, { Document, Schema } from 'mongoose';

export interface IProblem extends Document {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const ProblemSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
});

export default mongoose.model<IProblem>('Problem', ProblemSchema);
