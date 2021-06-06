import Image from 'next/image'
import Link from 'next/link'
import HeaderNav from '../components/primitives/HeaderNav'

export default function Discord() {
  return (
    <div className="pb-5">
      <HeaderNav />
      <div className="title text-4xl md:text-6xl text-center">Discord Features</div>
      <div className="flex justify-center items-center mt-6 w-full">
        <div className="w-full grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 xl:grid-cols-6 place-content-center mx-2">
          <div className="md:col-start-2 xl:col-start-3 col-span-3 xl:col-span-2 flex flex-col justify-center items-center text-center shadow-lg rounded-md bg-blue-900 text-white px-4 py-8">
            <div className="w-1/2 mb-5">
              <div className="aspect-w-16 aspect-h-7 shadow-md rounded-md overflow-hidden">
                <Image src="/images/discord.png" layout="fill" />
              </div>
            </div>
            <p className="text-xl font-bold">Features include:</p>
            <ol className="list-decimal pl-8 pr-6 spacing text-left">
              <li className="py-2">
                Once you've added Dessa, you can forget about it! It'll automatically set the Discord Rich prescence
                information, and stop it when you quit
              </li>
              <li className="py-2">Includes your character name</li>
              <li className="py-2">Includes your character class/specialisation</li>
              <li className="py-2">Includes your location, including correct fractal name</li>
              <li className="py-2">Includes your current play time</li>
            </ol>
            <p className="text-xl font-bold mt-5">Hopefully coming soon features include:</p>
            <ol className="list-decimal pl-8 pr-6 spacing text-left w-full">
              <li className="py-2">Pictures of the area for the bigger icon!</li>
              <li className="py-2">Specialization icon as the smaller icon!</li>
              <li className="py-2">Include Fractal level when in a fractal</li>
            </ol>
            <Link href="/#installation">
              <a className="text-xl font-bold mt-5 hover:underline text-blue-400">
                Find out how to install Dessa here →
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
