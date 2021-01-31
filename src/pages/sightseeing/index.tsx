import HeaderNav from '../../components/primitives/HeaderNav'
import { SightseeingList, SightseeingEntry } from '../../types/props'

export default function Sightseeing({ entries }: { entries: (SightseeingEntry & { id: string })[] }) {
  return (
    <div>
      <HeaderNav />
      <div className="title text-6xl text-center">Sightseeing Sessions</div>
      <div className="title text-2xl text-center">
        <a href="/map">Live map →</a>
      </div>
      <div className="flex flex-col justify-center items-center mt-5 w-full pr-2 pl-2">
        {entries.map((i) => (
          <a
            key={i.id}
            href={`/sightseeing/${i.id}`}
            className="w-full mb-5 grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 xl:grid-cols-7 place-content-center mr-2 ml-2"
          >
            <div className="md:col-start-2 xl:col-start-3 col-span-3 flex flex-col justify-center shadow-lg rounded-md bg-blue-900 text-white pr-4 pl-4 pt-6 pb-6">
              {i.name} →
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const sightseeingInfo: SightseeingList = require('../../../data/sightseeing.json')

  return {
    props: { entries: Object.entries<any>(sightseeingInfo).map(([id, { locations, ...entry }]) => ({ id, ...entry })) },
  }
}