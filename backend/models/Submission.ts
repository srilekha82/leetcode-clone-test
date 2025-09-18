import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  user: mongoose.Types.ObjectId;
  problem: mongoose.Types.ObjectId;
  code: string;
  language: string;
  status: string;
  result: string;
}

const SubmissionSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  status: { type: String, required: true },
  result: { type: String },
});

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);
