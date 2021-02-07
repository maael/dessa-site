import Link from 'next/link'
import HeaderNav from '../../components/primitives/HeaderNav'
import useSupa from '../../components/hooks/useSupa'

export default function Sightseeing() {
  const { data } = useSupa<{ id: number; name: string }>('sightseeing_chapters', 'id, name')
  return (
    <div>
      <HeaderNav />
      <div className="title text-4xl md:text-6xl text-center">Sightseeing Session</div>
      <div className="title text-2xl text-center">
        <Link href="/map">
          <a>Live map →</a>
        </Link>
      </div>
      <div className="flex flex-col justify-center items-center mt-5 w-full pr-2 pl-2">
        {data.map((i) => (
          <Link key={i.id} href={`/sightseeing/${i.id}`}>
            <a className="w-full mb-5 grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 xl:grid-cols-7 place-content-center mr-2 ml-2">
              <div className="md:col-start-2 xl:col-start-3 col-span-3 flex flex-col justify-center shadow-lg rounded-md bg-blue-900 text-white pr-4 pl-4 pt-6 pb-6">
                {i.name} →
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}
