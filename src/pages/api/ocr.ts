import { NextApiHandler } from 'next'
import FormData from 'form-data'
import fetch from 'isomorphic-fetch'
import leven from 'leven'

interface APIResult {
  ParsedResults: [{ ParsedText: string }]
  IsErroredOnProcessing: boolean
  ErrorMessage: string[]
  OCRExitCode: 1 | 2 | 3 | 4
}

type LikelyLine = { line: string; leven: number } | null

const handler: NextApiHandler = async (req, res) => {
  const { img, language = 'eng', filetype = 'png' } = req.body
  const form = new FormData()
  try {
    form.append('base64Image', img)
    form.append('language', language)
    form.append('filetype', filetype)
    const result = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        apikey: process.env.OCR_API_KEY!,
      },
      body: form as any,
    })
    const json: APIResult = await result.json()
    if (json.IsErroredOnProcessing) {
      throw new Error(json.ErrorMessage.join(', ') || 'Unknown error with OCR API')
    }
    const raw = json.ParsedResults.map(({ ParsedText }) => ParsedText).join('\n')
    const lines = raw
      .split('\n')
      .map((l) => l.replace(/\\r/g, '').trim())
      .filter(Boolean)
    let likelyFractalLine: LikelyLine | null = null
    lines.forEach((l) => {
      const hasNumbers = l.match(/\d+/)
      if (hasNumbers === null) return
      const lLeven = leven('fractal difficulty scale:', l.replace(/\d/g, '').trim())
      if (likelyFractalLine === null || lLeven < likelyFractalLine.leven) {
        likelyFractalLine = { line: l, leven: lLeven }
      }
    })
    const fractalLevel =
      (likelyFractalLine as LikelyLine) !== null
        ? parseInt(
            (((likelyFractalLine as unknown) as NonNullable<LikelyLine>).line.match(/(\d+)/) || [])[0] || '0',
            10
          )
        : 0
    res.json({
      raw,
      lines,
      meta: {
        fractalLevel,
      },
    })
  } catch (e) {
    console.error('[error]', e.message)
    res.status(500).json({
      img,
      language,
      filetype,
      error: e.message,
    })
  }
}

export default handler
