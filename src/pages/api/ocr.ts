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

function getLikelyLineForString(lines: string[], needle: string) {
  let likelyFractalLine: LikelyLine | null = null
  lines.forEach((l) => {
    const hasNumbers = l.match(/\d+/)
    if (hasNumbers === null) return
    const lLeven = leven(needle, l.replace(/\d/g, '').trim())
    if (likelyFractalLine === null || lLeven < likelyFractalLine.leven) {
      likelyFractalLine = { line: l, leven: lLeven }
    }
  })
  return (likelyFractalLine as LikelyLine) ? ((likelyFractalLine as unknown) as NonNullable<LikelyLine>).line : null
}

function getNumFromPossibleStr(str: string | null) {
  return str !== null ? parseInt((str.match(/(\d+)/) || [])[0] || '0', 10) : 0
}

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
    const likelyFractalLine = getLikelyLineForString(lines, 'Fractal Difficulty Scale:')
    const likelyPersonalFractalLine = getLikelyLineForString(lines, 'Personal Fractal Level:')
    res.json({
      raw,
      lines,
      meta: {
        fractalLevel: getNumFromPossibleStr(likelyFractalLine),
        personalFractalLevel: getNumFromPossibleStr(likelyPersonalFractalLine),
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
