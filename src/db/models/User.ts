import { Document, Schema, Model } from 'mongoose'
import { connection } from '../mongo'

export interface User {
  nickname: string
  apiKey?: string
  createdAt: string
  updatedAt: string
}

interface UserDocument extends User, Document {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserModel extends Model<UserDocument> {}

export const UserSchema = new Schema<UserDocument, UserModel>(
  {
    nickname: {
      type: String,
      required: true,
      trim: true,
    },
    apiKey: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    id: false,
  }
)

const User = connection.model<UserDocument, UserModel>('User', UserSchema)

export default User
