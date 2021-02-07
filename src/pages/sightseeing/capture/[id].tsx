import { createRef, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import HeaderNav from '../../../components/primitives/HeaderNav'
import useLink from '../../../components/hooks/useLink'
import { LinkData } from '../../../types/dessa'
import useSupa from '../../../components/hooks/useSupa'
import supabase from '../../../utils/supa'

export default function SightseeingCapture() {
  const { query } = useRouter()
  const { id: qId } = query
  const numericId = qId === 'new' ? null : Number(qId)
  const { data: chapter, refetch } = useSupa<{ name: string; description: string }>(
    'sightseeing_chapters',
    'name, description',
    `id eq ${numericId}`
  )
  const { data: chapterEntries } = useSupa<{
    chapter_id: number
    id: number
    hint_text: string
    avatar: [number, number, number]
    player_x: number
    player_y: number
  }>('sightseeing_entries', 'chapter_id, id, hint_text, avatar, player_x, player_y', `chapter_id eq ${query.id}`)

  const queriedChapter = chapter[0]
  const [capturedLinks, setCapturedLinks] = useState<LinkData[]>([])
  useEffect(() => {
    if (chapterEntries.length && !capturedLinks.length) {
      setCapturedLinks(
        chapterEntries.map(
          ({ id, avatar, hint_text, player_x, player_y }, i) =>
            (({
              ui_tick: i,
              context: {
                player_x,
                player_y,
              },
              avatar: {
                position: avatar,
              },
              identity: {
                name: 'Unknown',
              },
              id,
              hint: hint_text,
            } as unknown) as LinkData)
        )
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterEntries.length, capturedLinks])
  const { link } = useLink()
  const formRef = createRef<HTMLFormElement>()
  return (
    <div>
      <HeaderNav />
      <div className="title text-4xl md:text-6xl text-center">Sightseeing Capture</div>
      <div className="title text-2xl text-center">
        <a href="/map">Live map →</a>
      </div>
      <form
        ref={formRef}
        onSubmit={async (e) => {
          e.preventDefault()
          const name = (e.target as any).name.value
          const description = (e.target as any).description.value
          const entries = Object.values(formRef.current || {})
            .filter((en) => (en.name || '').startsWith('entries['))
            .reduce((acc, en) => ({ ...acc, [en.name]: en.value }), {})
          const cleanEntries: any[] = Object.entries(entries).reduce((acc, [k, v]) => {
            const match = k.match(/entries\[(?<idx>\d+)\]\[(?<field>.+)\]/)
            if (!match || !match.groups) return acc
            acc[match.groups.idx] = {
              ...(acc[match.groups.idx] || {}),
              [match.groups.field]: v,
            }
            return acc
          }, [])
          const isNewChapter = !(queriedChapter as typeof chapter[0] | undefined)
          const hasChangedChapter = !!(
            (queriedChapter as typeof chapter[0] | undefined) &&
            (queriedChapter.name !== name || queriedChapter.description !== description)
          )
          console.info('Has changed chapter', isNewChapter, hasChangedChapter)
          console.info('Sending', { name, description, cleanEntries })
          if (isNewChapter) {
            const result = await supabase
              .from('sightseeing_chapters')
              .insert({ name, description }, { returning: 'representation' })
            console.info('New chapter', (result.data || [])[0])
          } else if (hasChangedChapter) {
            const result = await supabase.from('sightseeing_chapters').update({ name, description }).eq('id', numericId)
            console.info('Updated chapter', result, numericId)
          } else {
            console.info('Skipping chapter update')
          }
          const submittedEntryIds = new Set(cleanEntries.map((i) => Number(i.id)).filter(Boolean))
          const newEntries = cleanEntries.filter((i) => !i.id)
          const deletedEntries = chapterEntries
            .filter(({ id }) => !submittedEntryIds.has(id))
            .map(({ id }) => id)
            .concat(cleanEntries.filter(({ id, hint }) => id && !hint).map(({ id }) => id))
          const updatedEntries = chapterEntries.filter(({ id }) => !deletedEntries.includes(id))
          // TODO: Handle updates
          console.info({
            submittedEntryIds,
            newEntries,
            updatedEntries,
            deletedEntries,
            mapped: newEntries.map(({ hint, x, y, avatar }) => ({
              chapter_id: numericId,
              hint_text: hint,
              player_x: x,
              player_y: y,
              avatar: JSON.parse(avatar),
            })),
          })
          const [newResult, deletedResult] = await Promise.all([
            supabase.from('sightseeing_entries').insert(
              newEntries.map(({ hint, x, y, avatar }) => ({
                chapter_id: numericId,
                hint_text: hint,
                player_x: x,
                player_y: y,
                avatar: JSON.parse(avatar),
              }))
            ),
            supabase.from('sightseeing_entries').delete().in('id', deletedEntries),
          ])
          console.info('saved', newResult, deletedResult)
          // TODO: Handle refetch properly
          await refetch().catch((err) => console.error(err))
        }}
      >
        <div className="mt-10 flex justify-center items-center">
          <button className="button mb-5" type="submit">
            Save
          </button>
        </div>
        <div className="w-full mb-5 grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 xl:grid-cols-7 place-content-center">
          <div className="md:col-start-2 xl:col-start-3 col-span-3 flex gap-2 flex-col justify-center shadow-lg rounded-md bg-blue-900 text-white pr-4 pl-4 pt-6 pb-6">
            <div className="flex gap-2 items-center">
              <p className="bg-blue-400 p-1 rounded-md w-24 text-center">Title</p>
              <input
                required
                name="name"
                defaultValue={(queriedChapter as typeof chapter[0] | undefined) && queriedChapter.name}
                placeholder="Title..."
                className="p-2 bg-blue-300 rounded-md flex-1 overflow-ellipsis placeholder-black text-black"
              />
            </div>
            <div className="flex gap-2 items-center">
              <p className="bg-blue-400 p-1 rounded-md w-24 text-center">Description</p>
              <input
                name="description"
                defaultValue={(queriedChapter as typeof chapter[0] | undefined) && queriedChapter.description}
                placeholder="Description..."
                className="p-2 bg-blue-300 rounded-md flex-1 overflow-ellipsis placeholder-black text-black"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mt-5 w-full pr-2 pl-2 pb-10">
          <button
            className="button mb-5"
            onClick={() =>
              setCapturedLinks((l) =>
                l.concat(
                  link ||
                    (({
                      ui_tick: Math.max(Math.max(...l.map((i) => i.ui_tick)), 0) + 1,
                      context: {
                        player_x: 0,
                        player_y: 0,
                      },
                      avatar: {
                        position: [0, 0, 0],
                      },
                      identity: {
                        name: 'Syaoranli',
                      },
                      hint: '',
                    } as unknown) as LinkData)
                )
              )
            }
          >
            Capture
          </button>
          {capturedLinks.map((i, idx) => (
            <div
              key={i.ui_tick}
              className="w-full mb-5 grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 xl:grid-cols-7 place-content-center mr-2 ml-2"
            >
              <input type="hidden" name={`entries[${idx}][id]`} value={(i as any).id} />
              <input type="hidden" name={`entries[${idx}][x]`} value={i.context.player_x.toFixed(2)} />
              <input type="hidden" name={`entries[${idx}][y]`} value={i.context.player_y.toFixed(2)} />
              <input type="hidden" name={`entries[${idx}][avatar]`} value={JSON.stringify(i.avatar.position)} />
              <div className="md:col-start-2 xl:col-start-3 col-span-3 flex gap-2 flex-col justify-center shadow-lg rounded-md bg-blue-900 text-white p-4">
                <div>
                  <div className="flex flex-row gap-2 items-center">
                    <p className="bg-blue-400 p-1 rounded-full float-right w-8 text-center">{idx + 1}</p>
                    <small className="bg-blue-400 p-1 rounded-md float-right">{i.identity.name}</small>
                    <input
                      placeholder="xy"
                      disabled
                      value={`${i.context.player_x.toFixed(2)}, ${i.context.player_y.toFixed(2)}`}
                      className="p-2 bg-blue-400 rounded-md flex-1 overflow-ellipsis placeholder-black text-black"
                    />
                    <input
                      placeholder="avatar"
                      disabled
                      value={i.avatar.position.map((j) => j.toFixed(2)).join(', ')}
                      className="p-2 bg-blue-400 rounded-md flex-1 overflow-ellipsis placeholder-black text-black"
                    />
                  </div>
                </div>
                <div>
                  <input
                    name={`entries[${idx}][hint]`}
                    defaultValue={(i as any).hint}
                    placeholder="Hint..."
                    className="p-2 bg-blue-300 rounded-md w-full overflow-ellipsis placeholder-black text-black"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  )
}
