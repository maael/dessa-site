import mongoose from 'mongoose'

export const connection = mongoose.createConnection(process.env.MONGO_DB_URI!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
