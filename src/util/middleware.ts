import { NextApiHandler } from 'next'

export const errorHandler: (fn: NextApiHandler) => NextApiHandler = (fn) => {
  return async function (req, res) {
    try {
      return (fn(req, res) || Promise.resolve()).catch((e) => {
        return res.status(500).json({ error: e.message })
      })
    } catch (e) {
      return res.status(500).json({ error: e.message })
    }
  }
}
