import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  submissions: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
});

export default mongoose.model<IUser>('User', UserSchema);
