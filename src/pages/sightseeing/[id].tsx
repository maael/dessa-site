import { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FaRegHeart as IconLike } from 'react-icons/fa'
import { toast } from 'react-toastify'
import useLink from '../../components/hooks/useLink'
import useLocalStorage, { Keys } from '../../components/hooks/useLocalStorage'
import useNativeNotifications from '../../components/hooks/useNativeNotifications'
import HeaderNav from '../../components/primitives/HeaderNav'
import Spinner from '../../components/primitives/Spinner'
import { useSightseeingChallenge, useSightseeingChallengeLike } from '../../util/api'
import { SightseeingEntry } from '../../types/db'

function ItemCard({ item: i }: { item: SightseeingEntry }) {
  return (
    <div className="flex flex-col justify-center shadow-lg rounded-md bg-blue-900 text-white px-4 py-4 gap-2">
      {i.hint.media && i.hint.media !== 'null' ? (
        <div className="w-full h-80 relative rounded-sm overflow-hidden shadow-md bg-blue-500">
          <Image src={i.hint.media} layout="fill" objectFit="cover" objectPosition="center" />
        </div>
      ) : null}
      <div className="flex flex-row items-center justify-center">
        <div className="flex-1 gap-1 flex flex-col">
          <div className="text-lg font-bold text-center">{i.hint.text}</div>
        </div>
      </div>
    </div>
  )
}

export default function Sightseeing() {
  const { link } = useLink()
  const { query } = useRouter()
  const [found = [], setFound] = useLocalStorage<string[]>(Keys.FoundSightseeingItems, [])
  const { sendNotification, requestPermission, allowed: allowedNotifications } = useNativeNotifications()
  const { data, isLoading } = useSightseeingChallenge(query.id as string)
  useEffect(() => {
    if (link) {
      const currentFound = (data || { items: [] }).items.filter(({ avatar }) =>
        link.avatar.position.every((p, i) => p > avatar[i] - 15 && p < avatar[i] + 15)
      )
      const newFound = currentFound.filter((i) => !found.includes(i._id))
      if (newFound.length) {
        newFound.forEach((f) => {
          sendNotification(`Found Dessa sightseeing location`, `For hint: ${f.hint.text}`)
          toast(`Found Dessa sightseeing location: ${f.hint.text}`, {
            type: 'success',
            autoClose: 10000,
          })
        })
        setFound((f) => [...new Set([...(f || []), ...currentFound.map(({ _id }) => _id)])])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [link?.avatar.position, data, found])

  const { mutate } = useSightseeingChallengeLike()

  return (
    <div>
      <HeaderNav />
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="pb-10">
          {data?.media && data?.media !== 'null' ? (
            <div className="w-3/4 mx-auto h-80 relative rounded-sm overflow-hidden shadow-md bg-blue-500 mt-16 mb-16">
              <Image src={data?.media} layout="fill" objectFit="cover" objectPosition="center" />
            </div>
          ) : null}
          <div className="mt-10">
            <div className="title text-4xl md:text-6xl text-center">{data?.name}</div>
            <div className="title text-2xl text-center">{data?.description}</div>
            <div
              className="title text-2xl text-center flex flex-row items-center justify-center gap-2 pb-5 cursor-pointer select-none"
              onClick={() => mutate(query.id as string)}
            >
              {data?.likes} <IconLike size={25} />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-5">
            <Link href={`/sightseeing/${query.id}/leaderboard`}>
              <a className="button mt-2">View leaderboard →</a>
            </Link>
            {query.editing ? (
              <Link href={`/sightseeing/edit/${query.id}`}>
                <a className="button mt-2">Edit →</a>
              </Link>
            ) : null}
            {allowedNotifications ? null : (
              <button className="button mt-2" onClick={requestPermission}>
                Allow notifications?
              </button>
            )}
          </div>
          <div className="title text-2xl text-center">Found</div>
          <div className="w-full mt-10 px-5 md:w-1/2 md:mx-auto gap-5 flex-col grid md:grid-cols-2">
            {data?.items
              .filter((i) => found.includes(i._id))
              .map((i) => (
                <ItemCard key={i._id} item={i} />
              ))}
          </div>
          <div className="title text-2xl text-center">To find</div>
          <div className="w-full mt-10 px-5 md:w-1/2 md:mx-auto gap-5 flex-col grid md:grid-cols-2">
            {data?.items
              .filter((i) => !found.includes(i._id))
              .map((i) => (
                <ItemCard key={i._id} item={i} />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
