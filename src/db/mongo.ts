import mongoose from 'mongoose'

export function connect() {
  if (mongoose.connections[0] && mongoose.connections[0].readyState) return mongoose.connections[0]

  return mongoose.createConnection(process.env.MONGO_DB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
}
