import { useRouter } from 'next/router'
import useSupa from '../../../components/hooks/useSupa'
import HeaderNav from '../../../components/primitives/HeaderNav'

export default function Sightseeing() {
  const { query } = useRouter()

  const { data: chapter } = useSupa<{ name: string; description: string }>(
    'sightseeing_chapters',
    'name, description',
    `id eq ${query.id}`
  )

  return (
    <div>
      <HeaderNav />
      <div className="title text-6xl text-center">{chapter[0]?.name}</div>
      <div className="title text-2xl text-center">{chapter[0]?.description}</div>
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