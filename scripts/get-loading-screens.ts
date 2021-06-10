import fs from 'fs'
import { join } from 'path'
import fetch from 'isomorphic-fetch'

const downloadFile = async (url: string, path: string) => {
  const res = await fetch(url)
  const fileStream = fs.createWriteStream(path)
  await new Promise((resolve, reject) => {
    ;(res.body as any).pipe(fileStream)
    ;(res.body as any).on('error', reject)
    fileStream.on('finish', resolve)
  })
}

async function getPage(cmcontinue?: string) {
  const searchParams = new URLSearchParams({
    action: 'query',
    list: 'categorymembers',
    cmtitle: 'Category:Map_loading_images',
    format: 'json',
    cmlimit: '500',
  })
  if (cmcontinue) {
    searchParams.append('cmcontinue', cmcontinue)
  }
  const res = await fetch(`https://wiki.guildwars2.com/api.php?${searchParams}`)
  return res.json()
}

function getFileImageUrl(id: number, title: string) {
  return fetch(
    `https://wiki.guildwars2.com/api.php?action=query&format=json&prop=imageinfo&iiprop=url&&titles=${title}`
  )
    .then((r) => r.json())
    .then((r) => (r.query?.pages[`${id}`]?.imageinfo || [])[0]?.url)
}

;(async () => {
  const page = await getPage()
  const files = await Promise.all(
    page.query.categorymembers.map(async ({ pageid, title }) => ({
      pageid,
      title,
      imageUrl: await getFileImageUrl(pageid, title),
      cleanName: title
        .replace(' loading screen', '')
        .replace('  ', ' ')
        .trim()
        .replace(/^File:/, '')
        .replace(/\s/g, '_')
        .replace("'", '_')
        .toLowerCase(),
    }))
  )
  await Promise.all(
    files.map(({ cleanName, imageUrl }) =>
      downloadFile(
        imageUrl,
        join(__dirname, '..', 'public', 'images', 'loading-screens', `loading-screen--${cleanName}`)
      )
    )
  )
})().catch((e) => console.error(e))
