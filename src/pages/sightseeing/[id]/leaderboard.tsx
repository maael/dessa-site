import { useEffect, useState } from 'react'
import useLink from '../../../components/hooks/useLink'
import useNativeNotifications from '../../../components/hooks/useNativeNotifications'
import HeaderNav from '../../../components/primitives/HeaderNav'
import { SightseeingList, SightseeingEntry } from '../../../types/props'

export default function Sightseeing({ entry }: { entry: SightseeingEntry }) {
  const { link } = useLink()
  const [found, setFound] = useState<string[]>([])
  const { sendNotification, requestPermission, allowed: allowedNotifications } = useNativeNotifications()

  useEffect(() => {
    if (link) {
      const currentFound = (entry.locations || []).filter(({ avatarPosition }) =>
        link.avatar.position.every((p, i) => p > avatarPosition[i] - 15 && p < avatarPosition[i] + 15)
      )
      const newFound = currentFound.filter((i) => !found.includes(i.id))
      if (newFound.length) {
        newFound.forEach((f) => {
          sendNotification(`Found Dessa sightseeing location`, `For hint: ${f.hint}`)
        })
        setFound((f) => [...new Set([...f, ...currentFound.map(({ id }) => id)])])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [link?.avatar.position, entry.locations, found])

  return (
    <div>
      <HeaderNav />
      <div className="title text-6xl text-center">{entry.name}</div>
      <div className="title text-2xl text-center">{entry.description}</div>
      <div className="flex flex-col justify-center items-center mt-5 w-full pr-2 pl-2">
        <div className="title text-4xl">Leaderboard</div>
        <div className="w-full grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 xl:grid-cols-7 place-content-center mr-2 ml-2 mt-4">
          <div className="md:col-start-2 xl:col-start-3 col-span-3 flex flex-col shadow-lg rounded-md bg-blue-900 text-white pr-4 pl-4 pt-6 pb-6">
            <div className="flex flex-row border-white border-solid border-b-2 pb-2 pr-2 pl-2">
              <div className="w-20">#</div>
              <div className="flex-1">Name</div>
              <div className="flex-1">Finished at</div>
            </div>
            <div className="p-5 text-center">No entries yet</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  const sightseeingInfo: SightseeingList = require('../../../../data/sightseeing.json')
  return {
    paths: Object.keys(sightseeingInfo).map((id) => ({ params: { id } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const sightseeingInfo: SightseeingList = require('../../../../data/sightseeing.json')
  return {
    props: { entry: sightseeingInfo[params.id] },
  }
}
