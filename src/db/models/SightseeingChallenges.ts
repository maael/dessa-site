import { Document, Schema, Model } from 'mongoose'
import { connection } from '../mongo'
import { SightseeingItemSchema, SightseeingItem } from './SightseeingItem'
import { UserSchema, User } from './User'

export interface SightseeingChallenge {
  name: string
  description: string
  media: string
  difficulty: number
  createdBy: number
  createdAt: string
  updatedAt: string
  likesByHashedIp: {
    [k: string]: number
  }
  items: SightseeingItem[]
  user: User
}

interface ItemDocument extends SightseeingChallenge, Document {}

interface ItemModel extends Model<ItemDocument> {
  likes: number
}

const itemSchema = new Schema<ItemDocument, ItemModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    media: {
      type: String,
      default: null,
    },
    difficulty: {
      type: Number,
      required: true,
    },
    createdBy: UserSchema,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    likesByHashedIp: {
      type: Map,
      of: Number,
      default: {},
    },
    items: [SightseeingItemSchema],
  },
  {
    toJSON: { virtuals: true },
    id: false,
  }
)

itemSchema.pre<any>('findOneAndUpdate', async function () {
  if (this._update.$inc && (Object.keys(this._update.$inc) || []).some((k) => k.startsWith('likesByHashedIp'))) return
  this._update.updatedAt = Date.now()
})

itemSchema.virtual('likes').get(function () {
  return Array.from((this.likesByHashedIp || new Map()).values()).reduce((acc: number, i: number) => acc + i, 0)
})

const Item = connection.model<ItemDocument, ItemModel>('SightseeingChallenges', itemSchema)

export default Item
