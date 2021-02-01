import { NextApiHandler } from 'next'
import FormData from 'form-data'
import fetch from 'isomorphic-fetch'

interface APIResult {
  ParsedResults: [{ ParsedText: string }]
  OCRExitCode: 1 | 2 | 3 | 4
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
    console.info('[json]', json)
    const raw = json.ParsedResults.map(({ ParsedText }) => ParsedText).join('\n')
    console.info('[raw]', raw)
    const lines = raw
      .split('\n')
      .map((l) => l.replace(/\\r/g, '').trim())
      .filter(Boolean)
    console.info('[lines]', lines)
    const fractalLevelLine =
      lines.filter(
        (l) => l.toLowerCase().startsWith('fractal scale:') || l.toLowerCase().startsWith('fractal difficulty scale:')
      )[0] || ''
    console.info('[fll]', fractalLevelLine)
    res.json({
      raw,
      lines,
      meta: {
        fractalLevel: parseInt((fractalLevelLine.match(/(\d+)/) || [])[0] || '0', 10),
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
