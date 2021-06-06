import { promises as fs } from 'fs'
import { join } from 'path'
import fetch from 'isomorphic-fetch'
import cheerio from 'cheerio'

async function getPage(cmcontinue?: string) {
  const bestiarySearchParams = new URLSearchParams({
    action: 'query',
    list: 'categorymembers',
    cmtitle: 'Category:NPC_articles_with_stub_sections',
    format: 'json',
    cmlimit: '500',
  })
  if (cmcontinue) {
    bestiarySearchParams.append('cmcontinue', cmcontinue)
  }
  const res = await fetch(`https://wiki.guildwars2.com/api.php?${bestiarySearchParams}`)
  return res.json()
}

const wait = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const FILES = {
  list: join(__dirname, '..', 'data', 'bestiary-list.json'),
  listEmbellished: join(__dirname, '..', 'data', 'bestiary-full.json'),
}

interface ListData {
  lastUpdated: string
  data: {
    pageid: number
    ns: number
    title: string
  }[]
}

async function getList(): Promise<ListData> {
  console.info('[start] Bestiary list')
  let existing
  try {
    existing = JSON.parse((await fs.readFile(FILES.list)).toString())
  } catch {
    /*Do nothing*/
  }
  if (existing) {
    console.info(`[info] Found existing with ${existing.data.length} items`)
    return existing
  }
  let continueToken = undefined
  let data = []
  let pageNumber = 0
  while (continueToken !== null) {
    pageNumber++
    const page = await getPage(continueToken)
    data = data.concat(page.query?.categorymembers || [])
    continueToken = page.continue?.cmcontinue || null
    console.info(`[info] Got page ${pageNumber}${continueToken ? '' : ' and reached the end'}`)
    if (continueToken) await wait(1000)
  }
  console.info(`[info] Retrieved ${data.length} items`)
  const toSave = {
    lastUpdated: new Date().toISOString(),
    data,
  }
  await fs.writeFile(FILES.list, JSON.stringify(toSave, undefined, 2), 'utf-8')
  console.info('[end] Bestiary list')
  return toSave
}

async function getItem(item: ListData['data'][0]) {
  const [parsetree, imageData] = await Promise.all([
    fetch(`https://wiki.guildwars2.com/api.php?action=parse&prop=parsetree&page=${item.title}&format=json`)
      .then((r) => r.json())
      .catch(() => undefined),
    fetch(
      `https://wiki.guildwars2.com/api.php?action=query&prop=images&titles=${item.title}&format=json&formatversion=2`
    )
      .then((r) => r.json())
      .catch(() => undefined),
  ])
  if (
    !parsetree?.parse ||
    !['== Combat abilities ==', '== Combat skills =='].some((i) => parsetree.parse.parsetree['*'].includes(i))
  )
    return

  let imageUrl
  try {
    const probableImage = imageData?.query?.pages[0]?.images?.find((p) => p.title.startsWith(`File:${item.title}`))
    if (probableImage) {
      const images = await fetch(
        `https://wiki.guildwars2.com/api.php?action=query&format=json&prop=imageinfo&iiprop=url&&titles=${probableImage.title}`
      ).then((r) => r.json())
      imageUrl = images.query?.pages[`${item.pageid}`]?.imageinfo[0]?.url
    }
  } catch {
    /*Do nothing*/
  }

  const $ = cheerio.load(parsetree.parse.parsetree['*'])
  const dataItem = $('part')
    .map((i, el) => {
      const name = $(el).find('name').text().trim()
      const value = $(el)
        .find('value')
        .text()
        .trim()
        .split(';')
        .map((i) => i.trim())
      return {
        name,
        value,
      }
    })
    .toArray()
    .reduce((acc, item) => ({ ...acc, [item.name]: item.value }), {} as any)

  const normalised = {
    level: dataItem.level,
    location: dataItem.location,
    organization: dataItem.organization,
    race: dataItem.race,
    requires: dataItem.requires,
  }

  return {
    ...normalised,
    ...item,
    imageUrl,
  }
}

;(async () => {
  const list = await getList()
  const embellished: any = []
  let idx = 0
  for (const item of list.data) {
    idx++
    try {
      const result = await getItem(item)
      if (result) embellished.push(result)
      console.info(`[info] ${idx}/${list.data.length} ${result ? 'Embellished' : 'Skipped'} ${item.title}`)
    } catch (e) {
      console.error('[error]', item.title, e)
    } finally {
      if (idx % 100 === 0) await fs.writeFile(FILES.listEmbellished, JSON.stringify(embellished, undefined, 2), 'utf-8')
      await wait(200)
    }
  }
  await fs.writeFile(FILES.listEmbellished, JSON.stringify(embellished, undefined, 2), 'utf-8')
})().catch((e) => console.error('[error]', e))

export {}
