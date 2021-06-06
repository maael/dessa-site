import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaRegHeart as IconLike, FaMapMarkerAlt as IconPin } from 'react-icons/fa'
import format from 'date-fns/format'
import HeaderNav from '../../components/primitives/HeaderNav'
import Spinner from '../../components/primitives/Spinner'
import { useSightseeingChallenges } from '../../util/api'

export default function Sightseeing() {
  const { query } = useRouter()
  const { data = [], isLoading } = useSightseeingChallenges()
  return (
    <div className="pb-10">
      <HeaderNav />
      <div className="title text-4xl md:text-6xl text-center">Sightseeing Challenges</div>
      {query.editing ? (
        <div className="flex flex-row justify-center items-center pt-2">
          <Link href={`/sightseeing/edit/new`}>
            <a className="button mt-2">Create New Challenge →</a>
          </Link>
        </div>
      ) : null}
      <div className="px-2 md:px-0">
        <div className="bg-blue-800 px-3 py-5 md:p-5 my-10 rounded-md w-full md:w-1/2 md:mx-auto flex flex-col gap-2 shadow-md">
          <h2 className="title" style={{ margin: 0 }}>
            What is this?
          </h2>
          <p>Good question!</p>
          <p>
            If you've played FFXIV, then it's pretty much a version of the Sightseeing Log from there, just as a plugin
            and website.
          </p>
          <p>
            If you've not played FFXIV, then it's a plugin and website, that lets you hunt around for spots in the
            glorious game of Guild Wars 2 based on hints, and it'll tick them off once you've found them. The idea is to
            try to stand where you think the picture was taken, or where the hint suggests.
          </p>
          <h2 className="title" style={{ marginBottom: 0, marginTop: '1em' }}>
            How's it work?
          </h2>
          <p>
            First off, you need to install the plugin, Dessa, which you can find instructions on how to do{' '}
            <Link href="/#installation">
              <a className="font-bold hover:underline text-blue-400">right here</a>
            </Link>
            .
          </p>
          <p>Then, just come back here, and choose a challenge, and click on it.</p>
          <p>
            If you keep the page in the background (or another monitor ideally), you can then run around in Guild Wars 2
            and hunt down those locations, and see over on the page as they get ticked off.
          </p>
          <p>Think a challenge is good? You can like it (up to 10 times) to show your appreciation!</p>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : null}
      <div className="w-full mt-10 px-5 md:w-1/2 md:mx-auto gap-5 flex-col grid md:grid-cols-2">
        {data.map((i) => (
          <Link key={i._id} href={`/sightseeing/${i._id}`}>
            <a>
              <div className="flex flex-col justify-center shadow-lg rounded-md bg-blue-900 text-white px-4 py-4 gap-2">
                {i.media && i.media !== 'null' ? (
                  <div className="w-full h-60 relative rounded-sm overflow-hidden shadow-md bg-blue-500">
                    <Image src={i.media} layout="fill" objectFit="cover" objectPosition="center" />
                  </div>
                ) : null}
                <div className="flex flex-row items-center">
                  <div className="flex-1 gap-1 flex flex-col">
                    <div className="text-lg font-bold">{i.name}</div>
                    <div className="text-sm">{i.description}</div>
                    <div className="text-sm flex flex-row items-center gap-1">
                      <IconPin /> {i.items.length} Location{i.items.length === 1 ? '' : 's'}
                    </div>
                    <div className="text-xs">
                      Created by {i.createdBy || 'a child of the mists'} at {format(new Date(i.createdAt), 'dd/MM/yy')}
                    </div>
                  </div>

                  <div className="flex flex-row justify-center items-center gap-2 text-sm">
                    {i.likes} <IconLike />
                  </div>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}
