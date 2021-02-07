import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useLink from '../../components/hooks/useLink'
import useNativeNotifications from '../../components/hooks/useNativeNotifications'
import HeaderNav from '../../components/primitives/HeaderNav'
import useSupa from '../../components/hooks/useSupa'
import Spinner from '../../components/primitives/Spinner'

export default function Sightseeing() {
  const { link } = useLink()
  const { query } = useRouter()
  const [found, setFound] = useState<number[]>([])
  const { sendNotification, requestPermission, allowed: allowedNotifications } = useNativeNotifications()
  const { data: chapter, loading: loadingChapter } = useSupa<{ name: string; description: string }>(
    'sightseeing_chapters',
    'name, description',
    `id eq ${query.id}`
  )
  const { data, loading: loadingEntries } = useSupa<{
    chapter_id: number
    id: number
    hint_text: string
    avatar: [number, number, number]
  }>('sightseeing_entries', 'chapter_id, id, hint_text, avatar', `chapter_id eq ${query.id}`)

  useEffect(() => {
    if (link) {
      const currentFound = data.filter(({ avatar }) =>
        link.avatar.position.every((p, i) => p > avatar[i] - 15 && p < avatar[i] + 15)
      )
      const newFound = currentFound.filter((i) => !found.includes(i.id))
      if (newFound.length) {
        newFound.forEach((f) => {
          sendNotification(`Found Dessa sightseeing location`, `For hint: ${f.hint_text}`)
        })
        setFound((f) => [...new Set([...f, ...currentFound.map(({ id }) => id)])])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [link?.avatar.position, data, found])

  return (
    <div>
      <HeaderNav />
      {loadingChapter || loadingEntries ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="title text-4xl md:text-6xl text-center">{chapter[0]?.name}</div>
          <div className="title text-2xl text-center">{chapter[0]?.description}</div>
          <div className="flex flex-col justify-center items-center">
            <Link href={`/sightseeing/${query.id}/leaderboard`}>
              <a className="button mt-2">View leaderboard →</a>
            </Link>
            {allowedNotifications ? null : (
              <button className="button mt-2" onClick={requestPermission}>
                Allow notifications?
              </button>
            )}
          </div>
          <div className="title text-2xl text-center">Found</div>
          <div className="flex flex-col justify-center items-center mt-5 w-full pr-2 pl-2">
            {data
              .filter((i) => found.includes(i.id))
              .map((i) => (
                <div
                  key={i.id}
                  className="w-full mb-5 grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 xl:grid-cols-7 place-content-center mr-2 ml-2"
                >
                  <div className="md:col-start-2 xl:col-start-3 col-span-3 flex flex-col justify-center shadow-lg rounded-md bg-blue-900 text-white pr-4 pl-4 pt-6 pb-6">
                    {i.hint_text}
                  </div>
                </div>
              ))}
          </div>
          <div className="title text-2xl text-center">To find</div>
          <div className="flex flex-col justify-center items-center mt-5 w-full pr-2 pl-2">
            {data
              .filter((i) => !found.includes(i.id))
              .map((i) => (
                <div
                  key={i.id}
                  className="w-full mb-5 grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 xl:grid-cols-7 place-content-center mr-2 ml-2"
                >
                  <div className="md:col-start-2 xl:col-start-3 col-span-3 flex flex-col justify-center shadow-lg rounded-md bg-blue-900 text-white pr-4 pl-4 pt-6 pb-6">
                    {i.hint_text}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  )
}
