import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import classnames from 'classnames'
import { HiArrowCircleRight, HiEye } from 'react-icons/hi'
import { FaDiscord, FaGithub, FaReddit, FaSkull } from 'react-icons/fa'
import ConnectionWelcome from '../components/primitives/ConnectionWelcome'
import Spinner from '../components/primitives/Spinner'

export default function Index() {
  const { asPath } = useRouter()
  const [highlightInstall, setHighlightInstall] = useState(() => asPath.includes('#installation'))
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
          <div className="w-full grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 xl:grid-cols-6 place-content-center mr-2 ml-2">
            <div className="md:col-start-2 xl:col-start-3 col-span-3 xl:col-span-2 flex flex-col justify-center items-center text-center shadow-lg rounded-md bg-blue-900 text-white pr-4 pl-4 pt-6 pb-6">
              <div className="mb-2">
                <Image src="/images/gw2.png" width={200} height={200} />
              </div>
              A tool to help open up all the data about you playing Guild Wars 2, so it can be used to create
              interesting tools that react to what's actually happening in the game as you play.
              <br />
              <br />
              <p>
                Plus, I made it because I wanted the Sightseeing Log from Final Fantasy XIV in Guild Wars 2, as Guild
                Wars 2 is a super fun game to explore, and this is an excuse to do just that. You can check that bit out{' '}
                <Link href="/sightseeing">
                  <a className="font-bold hover:underline text-blue-400">here</a>
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="title text-4xl">Tools</div>
          <div className="grid gap-5 grid-cols-1 lg:grid-cols-6 mt-1 place-content-center mr-2 ml-2 md:mr-10 md:ml-10">
            <Link href="/discord">
              <a className="lg:col-start-2 card">
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
            {/* <Link href="/map">
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
            </Link> */}
            {/* <Link href="/live-map">
              <a className="card">
                <div className="card-icon-area">
                  <FaMapMarkedAlt />
                </div>
                <div className="flex-1">
                  A live map showing everyone with Dessa installed and online, who wants to be seen.
                </div>
                <HiArrowCircleRight className="mt-4 text-4xl" />
              </a>
            </Link> */}
            <Link href="/bestiary">
              <a className="card">
                <div className="card-icon-area">
                  <FaSkull />
                </div>
                <div className="flex-1">
                  A bestiary of most creatures and enemies in the game, hunt them down and get into combat with them to
                  tick them off the list, can you find them all?
                </div>
                <HiArrowCircleRight className="mt-4 text-4xl" />
              </a>
            </Link>
            {/* <Link href="/rotation">
              <a className="xl:col-start-1 card">
                <div className="card-icon-area">
                  <FaSpinner />
                </div>
                <div className="flex-1">A very basic rotation tester. Mainly just to show arcDps integration.</div>
                <HiArrowCircleRight className="mt-4 text-4xl" />
              </a>
            </Link> */}
            {/* <Link href="/debug/raw">
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
            </Link> */}
            <Link href="https://github.com/maael/dessa-site/issues/new">
              <a className="card">
                <div className="card-icon-area">
                  <FaGithub />
                </div>
                <div className="flex-1">Got ideas? Let me know what you think would be good to add!</div>
                <HiArrowCircleRight className="mt-4 text-4xl" />
              </a>
            </Link>
          </div>
          {/* <div className="button mt-8">
            More tools <HiArrowCircleRight className="ml-2 text-xl" />
          </div> */}
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
              <ol className="list-decimal pl-8 pr-6 spacing">
                <li className="pb-2 pt-2">
                  Download{' '}
                  <a
                    className="font-bold hover:underline text-blue-400"
                    href="https://www.deltaconnected.com/arcdps/x64/"
                  >
                    ArcDps (d3d9.dll) →
                  </a>
                </li>
                <li className="pb-2 pt-2">
                  Download{' '}
                  <a
                    className="font-bold hover:underline text-blue-400"
                    href="http://github.com/maael/dessa/releases/latest"
                  >
                    Dessa (dessa.dll) →
                  </a>{' '}
                  - just the top one under assets.
                </li>
                <li className="pb-2 pt-2">
                  Right click on d3d9.dll and dessa.dll and view properties, and click on {'"'}Unblock{'"'} for each,
                  and click apply.
                </li>
                <li className="pb-2 pt-2">
                  Move to your Guild Wars 2 bin64 folder, depending on where you installed the game this will be
                  something like: <br />
                  <code className="bg-blue-500 px-1 rounded-sm text-sm">C:\Program Files\Guild Wars 2\bin64</code>
                </li>
                <li className="pb-2 pt-2">
                  Start up the game and load in as a character, and the message at the top of this page should change,
                  with a green tick in the top right corner.
                </li>
                <li className="pb-2 pt-2">You're good to go, that's it!</li>
              </ol>
              <p className="text-center mt-2">
                Any issues setting this up? Feel free to reach out{' '}
                <a
                  className="font-bold hover:underline text-blue-400"
                  href="https://github.com/maael/dessa-site/issues/new"
                >
                  here
                </a>{' '}
                so we can fix it.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mt-5 w-full pr-2 pl-2">
          <div className="title text-4xl">FAQs</div>
          <div className="w-full grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 xl:grid-cols-7 place-content-center mr-2 ml-2">
            <div className="md:col-start-2 xl:col-start-3 col-span-3 flex flex-col justify-center shadow-lg rounded-md bg-blue-900 text-white pr-4 pl-4 pt-6 pb-6">
              <div className="mb-6">
                <div className="title" style={{ marginTop: 0 }}>
                  How does this work?
                </div>
                It emits the{' '}
                <a
                  className="font-bold hover:underline text-blue-400"
                  href="https://wiki.guildwars2.com/wiki/API:MumbleLink"
                >
                  MumbleLink data
                </a>{' '}
                that Guild Wars 2 provides, as well as the data arcDps pumps out, making it available to other
                applications.
              </div>
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
                Let me know what the issue is{' '}
                <a
                  className="font-bold hover:underline text-blue-400"
                  href="https://github.com/maael/dessa-site/issues/new"
                >
                  here
                </a>
                , and we'll figure it out.
              </div>
              <div className="mb-6">
                <div className="title" style={{ marginTop: 0 }}>
                  I have an idea for something to add!
                </div>
                Let me know{' '}
                <a
                  className="font-bold hover:underline text-blue-400"
                  href="https://github.com/maael/dessa-site/issues/new"
                >
                  here
                </a>
                , and I'll get right on it.
              </div>
              <div>
                <div className="title" style={{ marginTop: 0 }}>
                  My inventory is cluttered and I need help!
                </div>
                Hey, I made another tool for that! Check out{' '}
                <a className="font-bold hover:underline text-blue-400" href="https://dedupe.mael.tech">
                  Dedupe-o-tron
                </a>
                , and get that inventory squeaky clean. Or try to anyway.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-1 bg-gray-700 text-white text-center flex justify-center items-center">
        Made by
        <a
          className="font-bold ml-1 text-blue-400 hover:text-blue-500 flex flex-row justify-center items-center gap-1"
          href="https://github.com/maael"
        >
          <FaGithub /> Maael
        </a>
        <a
          className="font-bold ml-1 text-blue-400 hover:text-blue-500 flex flex-row justify-center items-center gap-1"
          href="https://reddit.com/u/maael"
        >
          <FaReddit /> Maael
        </a>
      </div>
    </div>
  )
}
