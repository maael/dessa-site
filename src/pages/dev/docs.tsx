import Image from 'next/image'
import HeaderNav from '../../components/primitives/HeaderNav'

export default function Docs() {
  return (
    <div>
      <HeaderNav />
      <div className="title text-4xl md:text-6xl text-center">Docs</div>
      <div className="flex justify-center items-center mt-6 w-full">
        <div className="w-full grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 xl:grid-cols-6 place-content-center mx-2">
          <div className="md:col-start-2 xl:col-start-3 col-span-3 xl:col-span-2 flex flex-col justify-center items-center text-center shadow-lg rounded-md bg-blue-900 text-white px-4 py-8">
            <div className="w-1/2 mb-5">
              <div className="aspect-w-16 aspect-h-14 shadow-md rounded-md overflow-hidden">
                <Image src="https://static.staticwars.com/quaggans/construction.jpg" layout="fill" />
              </div>
            </div>
            <p className="text-xl font-bold">
              Work in progress, for now you can see this site on{' '}
              <a className="font-bold hover:underline text-blue-400" href="https://github.com/maael/dessa-site">
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
