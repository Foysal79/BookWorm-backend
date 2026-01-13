import mongoose, { Schema } from 'mongoose';
import { IUser } from './user.interface';

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User',
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
