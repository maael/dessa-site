import Image from 'next/image'
import Link from 'next/link'
import { FaRegHeart as IconLike, FaMapMarkerAlt as IconPin } from 'react-icons/fa'
import format from 'date-fns/format'
import HeaderNav from '../../components/primitives/HeaderNav'
import { useSightseeingChallenges } from '../../util/api'

export default function Sightseeing() {
  const { data = [] } = useSightseeingChallenges()
  return (
    <div>
      <HeaderNav />
      <div className="title text-4xl md:text-6xl text-center">Sightseeing Challenges</div>
      <div className="w-full mt-10 px-5 md:w-1/2 md:mx-auto gap-5 flex-col grid md:grid-cols-2">
        {data.map((i) => (
          <Link key={i._id} href={`/sightseeing/${i._id}`}>
            <a>
              <div className="flex flex-col justify-center shadow-lg rounded-md bg-blue-900 text-white px-4 py-4 gap-2">
                {i.media ? (
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
                      Created by {i.createdBy || 'Unknown User'} at {format(new Date(i.createdAt), 'dd/MM/yy')}
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
