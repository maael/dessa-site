import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import classnames from 'classnames'
import { HiArrowCircleRight, HiEye, HiCog, HiUserGroup } from 'react-icons/hi'
import { FaDiscord, FaMapMarkedAlt, FaSpinner } from 'react-icons/fa'
import ConnectionWelcome from '../components/primitives/ConnectionWelcome'
import Spinner from '../components/primitives/Spinner'

export default function Index() {
  const [highlightInstall, setHighlightInstall] = useState(false)
  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-800 flex-1 flex flex-col items-center pb-10">
        <div className="mt-2 relative z-10">
          <div className="mt-16">
            <div className="title text-6xl text-center">Dessa</div>
            <div className="flex flex-col p-5 items-center text-center">
              <ConnectionWelcome />
            </div>
            <div className="absolute top-0" style={{ zIndex: -1, left: 'calc(50%)', transform: 'translateX(-50%)' }}>
              <Spinner />
            </div>
          </div>
        </div>
        <a className="button" href="#installation" onClick={() => setHighlightInstall(true)}>
          Get started <HiArrowCircleRight className="ml-2 text-xl" />
        </a>
        <div className="flex flex-col justify-center items-center">
          <div className="title text-4xl">What is it?</div>
        </div>
        <div className="flex justify-center items-center mt-2 w-full">
          <div className="w-full grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 xl:grid-cols-7 place-content-center mr-2 ml-2">
            <div className="md:col-start-2 xl:col-start-3 col-span-3 flex flex-col justify-center items-center text-center shadow-lg rounded-md bg-blue-900 text-white pr-4 pl-4 pt-6 pb-6">
              <div className="mb-2">
                <Image src="/images/gw2.png" width={200} height={200} />
              </div>
              A tool to help open up all the data about you playing Guild Wars 2, so it can be used to create
              interesting tools that react to what's actually happening in the game as you play.
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="title text-4xl">Tools</div>
          <div className="grid gap-5 md:gap-10 grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 mt-1 place-content-center mr-2 ml-2 md:mr-10 md:ml-10">
            <Link href="/discord">
              <a className="xl:col-start-2 card">
                <div className="card-icon-area">
                  <FaDiscord />
                </div>
                <div className="flex-1">
                  Show your activity live in Discord with expanded Rich Presence - showing off the name of the character
                  you're playing, their class, and what map you're in.
                </div>
                <HiArrowCircleRight className="mt-4 text-4xl" />
              </a>
            </Link>
            <Link href="/sightseeing">
              <a className="card">
                <div className="card-icon-area">
                  <HiEye />
                </div>
                <div className="flex-1">
                  Sightseeing logs, find points in the world from pictures and text clues. New ones released each week,
                  race to find them first with live leaderboards.
                </div>
                <HiArrowCircleRight className="mt-4 text-4xl" />
              </a>
            </Link>
            <Link href="/map">
              <a className="card">
                <div className="card-icon-area">
                  <HiUserGroup />
                </div>
                <div className="flex-1">
                  Fractal speed clears, track different group compositions and fight against each other on the
                  leaderboards, including number of times your team goes downstate.
                </div>
                <HiArrowCircleRight className="mt-4 text-4xl" />
              </a>
            </Link>
            <Link href="/map">
              <a className="xl:col-start-2 card">
                <div className="card-icon-area">
                  <FaMapMarkedAlt />
                </div>
                <div className="flex-1">
                  A live map showing everyone with Dessa installed and online, letting you see where your friends are
                  without having to ask.
                </div>
                <HiArrowCircleRight className="mt-4 text-4xl" />
              </a>
            </Link>
            <Link href="/rotation">
              <a className="card">
                <div className="card-icon-area">
                  <FaSpinner />
                </div>
                <div className="flex-1">
                  A rotation tester, to let you practice and learn your skill ordering against a defined list of skills
                  for openers, for those huge numbers.
                </div>
                <HiArrowCircleRight className="mt-4 text-4xl" />
              </a>
            </Link>
            <Link href="/debug/raw">
              <a className="card">
                <div className="card-icon-area">
                  <HiCog />
                </div>
                <div className="flex-1">
                  Debug tools to help test that Dessa is setup correctly, or to write tools using the data, showing you
                  everything that gets collected.
                </div>
                <HiArrowCircleRight className="mt-4 text-4xl" />
              </a>
            </Link>
          </div>
          <div className="button mt-8">
            More tools <HiArrowCircleRight className="ml-2 text-xl" />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mt-5 w-full pr-2 pl-2">
          <div className="title text-4xl" id="installation">
            Installation
          </div>
          <div className="w-full grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 xl:grid-cols-7 place-content-center mr-2 ml-2">
            <div
              className={classnames(
                'md:col-start-2 xl:col-start-3 col-span-3 flex flex-col shadow-lg rounded-md bg-blue-900 text-white pr-4 pl-4 pt-6 pb-6',
                { 'ring-2 ring-blue-400 ring-offset-4 ring-offset-gray-800': highlightInstall }
              )}
            >
              <ol className="list-decimal pl-8 pr-6">
                <li>
                  Download{' '}
                  <a
                    className="font-bold hover:underline text-blue-400"
                    href="https://www.deltaconnected.com/arcdps/x64/"
                  >
                    ArcDps (d3d9.dll) →
                  </a>
                </li>
                <li>
                  Download{' '}
                  <a
                    className="font-bold hover:underline text-blue-400"
                    href="http://github.com/maael/dessa/releases/latest"
                  >
                    Dessa (dessa.dll) →
                  </a>
                </li>
                <li>
                  Right click on d3d9.dll and dessa.dll and view properties, and click on {'"'}Unblock{'"'} for each,
                  and click apply.
                </li>
                <li>Move to your Guild Wars 2 bin64 folder.</li>
                <li>Start up the game and the message at the top of this page should change.</li>
                <li>You're good to go, that's it!</li>
              </ol>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mt-5 w-full pr-2 pl-2">
          <div className="title text-4xl">FAQs</div>
          <div className="w-full grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 xl:grid-cols-7 place-content-center mr-2 ml-2">
            <div className="md:col-start-2 xl:col-start-3 col-span-3 flex flex-col justify-center shadow-lg rounded-md bg-blue-900 text-white pr-4 pl-4 pt-6 pb-6">
              <div className="mb-6">
                <div className="title" style={{ marginTop: 0 }}>
                  My game info isn't showing in Discord, what gives?
                </div>
                This is a bug I'm trying to fix at the moment, but you can fix it by making sure Discord is opening and
                running <i>before</i> you start the game.
              </div>
              <div className="mb-6">
                <div className="title" style={{ marginTop: 0, marginBottom: 2 }}>
                  This seems pretty cool, I'd like to make something with the data!
                </div>
                Sounds great! Check out the docs{' '}
                <Link href="/dev/docs">
                  <a className="font-bold hover:underline text-blue-400">here →</a>
                </Link>
                .
              </div>
              <div className="mb-6">
                <div className="title" style={{ marginTop: 0 }}>
                  Something isn't working? Fix it!
                </div>
                Let me know what the issue is by{' '}
                <a className="font-bold hover:underline text-blue-400" href="mailto:matt.a.elphy+dessa@gmail.com">
                  emailing me
                </a>
                , and I'll get right on it.
              </div>
              <div>
                <div className="title" style={{ marginTop: 0 }}>
                  I have an idea for something to add!
                </div>
                Let me know by{' '}
                <a className="font-bold hover:underline text-blue-400" href="mailto:matt.a.elphy+dessa@gmail.com">
                  emailing me
                </a>
                , and I'll get right on it.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-1 bg-gray-700 text-white text-center flex justify-center items-center">
        Made by
        <a className="font-bold ml-1 text-blue-400 hover:text-blue-500" href="https://githib.com/maael">
          Matt Elphick
        </a>
      </div>
    </div>
  )
}
