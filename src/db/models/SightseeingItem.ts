import { Document, Schema, Model } from 'mongoose'
import { connect } from '../mongo'

const connection = connect()

export interface SightseeingItem {
  hint: {
    text: string
    media: string
  }
  avatar: [number, number, number]
  player: {
    x: number
    y: number
  }
  accuracy: number
  createdAt: string
  updatedAt: string
}

interface ItemDocument extends SightseeingItem, Document {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ItemModel extends Model<ItemDocument> {}

export const SightseeingItemSchema = new Schema<ItemDocument, ItemModel>(
  {
    hint: {
      text: {
        type: String,
        required: true,
        trim: true,
      },
      media: {
        type: String,
        default: null,
      },
    },
    avatar: {
      type: [Number],
      default: [0, 0, 0],
    },
    player: {
      x: {
        type: Number,
        default: 0,
      },
      y: {
        type: Number,
        default: 0,
      },
    },
    accuracy: {
      type: Number,
      default: 5,
    },
  },
  {
    toJSON: { virtuals: true },
    id: false,
  }
)

const SightseeingItemModel = connection.model<ItemDocument, ItemModel>('SightseeingItem', SightseeingItemSchema)

export default SightseeingItemModel
