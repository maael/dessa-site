import crypto from 'crypto'
import { NextApiHandler } from 'next'
import mongoose from 'mongoose'
import SightseeingChallenge from '../../db/models/SightseeingChallenges'
import { errorHandler } from '../../util/middleware'
import { getFormData, attachFiles } from '../../util/form'

const handler: NextApiHandler = async (req, res) => {
  const { id, action } = req.query
  if (req.method === 'GET') {
    if (!id) {
      const challenges = await SightseeingChallenge.find()
      return res.json(challenges)
    } else {
      const challenge = await SightseeingChallenge.findById(id)
      return res.json(challenge)
    }
  } else if (req.method === 'POST') {
    const id = new mongoose.Types.ObjectId().toString()
    const { fields, files } = await getFormData(req, res, id)
    const fieldsWithFiles = attachFiles(fields, files)
    const created = await SightseeingChallenge.create([{ _id: id, ...fieldsWithFiles }])
    return res.json(created)
  } else if (req.method === 'PUT') {
    if (action === 'like') {
      if (!id) {
        throw new Error('Missing ID')
      }
      const hashedIp = crypto
        .createHash('md5')
        .update(req.headers['x-real-ip']?.toString() || '127.0.0.1')
        .digest('hex')
      const hashPath = `likesByHashedIp.${hashedIp}`
      const challenge = await SightseeingChallenge.findOneAndUpdate(
        { _id: id, $or: [{ [hashPath]: { $lt: 10 } }, { [hashPath]: null }] },
        { $inc: { [hashPath]: 1 } },
        { new: true }
      )
      return res.json(challenge)
    }
  } else if (req.method === 'PATCH') {
    if (!id) {
      throw new Error('Missing ID')
    }
    const { fields, files } = await getFormData(req, res)
    const fieldsWithFiles = attachFiles(fields, files)
    const challenge = await SightseeingChallenge.findByIdAndUpdate(id, fieldsWithFiles, { new: true })
    return res.json(challenge)
  } else {
    res.status(501).json({ error: 'Not implemented' })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default errorHandler(handler)
