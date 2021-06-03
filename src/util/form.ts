import { NextApiRequest, NextApiResponse } from 'next'
import { S3 } from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import format from 'date-fns/format'
import { traverse } from './object'

const s3 = new S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
})

const TWO_MB = 2e6

function cleanNulls(val: any, _: string) {
  return typeof val === 'string' ? (val === 'null' ? null : val) : val
}

function tidyFields(fields: any) {
  return traverse(fields, [cleanNulls])
}

export function getFormData(req: NextApiRequest, res: NextApiResponse, id?: string): Promise<any> {
  const uploadMiddleware = multer({
    storage: multerS3({
      s3,
      bucket: 'dessa-production',
      acl: 'public-read',
      cacheControl: 'max-age=31536000',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req, file, cb) {
        const metadata: any = {
          sightseeingChallengeId: id || (req as any).body._id,
          type: file.fieldname.startsWith('items[') ? 'item' : 'media',
        }
        if (metadata.type === 'item') {
          metadata.item = file.fieldname.match(/\[(\d+)\]/)![1]
        }
        cb(null, metadata)
      },
      key: function (req, file, cb) {
        const type = file.fieldname.startsWith('items[') ? 'item' : 'media'
        const path = type === 'media' ? 'media' : `item/${file.fieldname.match(/\[(\d+)\]/)![1]}`
        cb(null, `sightseeing/${id || (req as any).body._id}/${path}-${format(new Date(), 'yy-MM-dd--HH-mm')}`)
      },
    }),
    limits: {
      fileSize: TWO_MB,
    },
  })
  return new Promise((resolve, reject) => {
    uploadMiddleware.any()(req as any, res as any, (err) => {
      if (err) return reject(err)
      resolve({ fields: tidyFields(req.body), files: (req as any).files })
    })
  })
}

export function attachFiles(fields: any, files: any) {
  files.forEach((f) => {
    if (f.metadata.type === 'media') {
      fields.media = f.location
    } else if (f.metadata.type === 'item') {
      if (fields.items[f.metadata.item] !== undefined) {
        fields.items[f.metadata.item].hint.media = f.location
      }
    }
  })
  return fields
}
