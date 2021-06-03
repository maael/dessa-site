import { createRef, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import HeaderNav from '../../../components/primitives/HeaderNav'
import useLink from '../../../components/hooks/useLink'
import { useSightseeingChallenge, useSightseeingChallengeCreateOrUpdate } from '../../../util/api'
import { LinkData } from '../../../types/dessa'

export default function SightseeingCapture() {
  const { query, push } = useRouter()
  const { id: qId } = query
  const safeId = qId === 'new' ? null : (qId as string)
  const { data } = useSightseeingChallenge(safeId)
  const { mutate } = useSightseeingChallengeCreateOrUpdate()

  const [capturedLinks, setCapturedLinks] = useState<LinkData[]>([])
  useEffect(() => {
    if (data?.items.length && !capturedLinks.length) {
      setCapturedLinks(
        data.items.map(
          ({ _id, avatar, hint, player }, i) =>
            (({
              ui_tick: i,
              context: {
                player_x: player.x,
                player_y: player.y,
              },
              avatar: {
                position: avatar,
              },
              identity: {
                name: 'Unknown',
              },
              _id,
              hint: hint.text,
              media: hint.media,
            } as unknown) as LinkData)
        )
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.items.length, capturedLinks])
  const { link } = useLink()
  const formRef = createRef<HTMLFormElement>()
  return (
    <div>
      <HeaderNav />
      <div className="title text-4xl md:text-6xl text-center">Sightseeing Capture</div>
      <form
        ref={formRef}
        onSubmit={async (e) => {
          e.preventDefault()
          const form = (e.target as any).elements
          const name = form.name.value
          const description = form.description.value
          const existingMedia = form.existingMedia.value
          const media = form.media.files.item(0)
          const entries = Object.entries(form)
            .filter(([name]) => (name || '').startsWith('entries['))
            .reduce((acc, [name, el]: any) => ({ ...acc, [name]: el.files ? el.files.item(0) : el.value }), {})
          const cleanEntries: any[] = Object.entries(entries).reduce((acc, [k, v]) => {
            const match = k.match(/entries\[(?<idx>\d+)\]\[(?<field>.+)\]/)
            if (!match || !match.groups) return acc
            acc[match.groups.idx] = {
              ...(acc[match.groups.idx] || {}),
              [match.groups.field]: v === 'null' ? null : v,
            }
            return acc
          }, [])

          const items = cleanEntries.map(({ hint, x, y, avatar, media, existingMedia }) => ({
            hint: { text: hint, media: existingMedia || media },
            player: { x, y },
            avatar: JSON.parse(avatar),
          }))

          const challenge = {
            _id: safeId,
            name,
            description,
            media: existingMedia || media,
            difficulty: 5,
            items,
          }

          await mutate(challenge, {
            onSuccess: async (result) => {
              push(`/sightseeing/${result._id}`)
            },
          })
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
                defaultValue={(data as typeof data | undefined) && data?.name}
                placeholder="Title..."
                className="p-2 bg-blue-300 rounded-md flex-1 overflow-ellipsis placeholder-black text-black"
              />
            </div>
            <div className="flex gap-2 items-center">
              <p className="bg-blue-400 p-1 rounded-md w-24 text-center">Description</p>
              <input
                name="description"
                defaultValue={(data as typeof data | undefined) && data?.description}
                placeholder="Description..."
                className="p-2 bg-blue-300 rounded-md flex-1 overflow-ellipsis placeholder-black text-black"
              />
            </div>
            <div className="flex gap-2 items-center">
              <p className="bg-blue-400 p-1 rounded-md w-24 text-center">Media</p>
              <input
                name="media"
                type="file"
                placeholder="Media..."
                className="p-2 bg-blue-300 rounded-md flex-1 overflow-ellipsis placeholder-black text-black"
              />
              <input type="hidden" name="existingMedia" value={data?.media} />
            </div>
            {data?.media && data?.media !== 'null' ? (
              <div className="relative h-40 w-full rounded-sm overflow-hidden">
                <Image src={data.media} layout="fill" objectFit="contain" />
              </div>
            ) : null}
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
                      media: null,
                    } as unknown) as LinkData)
                )
              )
            }
          >
            Capture New Entry
          </button>
          {capturedLinks.map((i, idx) => (
            <div
              key={i.ui_tick}
              className="w-full mb-5 grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 xl:grid-cols-7 place-content-center mr-2 ml-2"
            >
              <input type="hidden" name={`entries[${idx}][id]`} value={(i as any)._id} />
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
                <div>
                  <input
                    type="file"
                    name={`entries[${idx}][media]`}
                    placeholder="Media..."
                    className="p-2 bg-blue-300 rounded-md w-full overflow-ellipsis placeholder-black text-black"
                  />
                  <input type="hidden" name={`entries[${idx}][existingMedia]`} value={(i as any).media} />
                </div>
                {(i as any).media && (i as any).media !== 'null' ? (
                  <div className="relative h-40 w-full rounded-sm overflow-hidden">
                    <Image src={(i as any).media} layout="fill" objectFit="contain" />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  )
}
