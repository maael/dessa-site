import { useMemo, useRef } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import useSWR from 'swr'
import classnames from 'classnames'
import { HiArrowCircleRight, HiEye, HiCog, HiUserGroup } from 'react-icons/hi'
import { professionMap, mountMap, raceMap } from '../../data/link'
import ConnectionStatus from '../components/primitives/ConnectionStatus'
import { LinkData } from '../types'

export default function Index() {
  const { readyState, lastJsonMessage } = useWebSocket('ws://localhost:3012', {
    reconnectInterval: 5000,
    reconnectAttempts: Infinity,
    shouldReconnect: () => true,
  })
  const lastLinkMessage = useRef<LinkData | null>(null)
  lastLinkMessage.current = useMemo(
    () => (lastJsonMessage && lastJsonMessage.type === 'link' ? lastJsonMessage : lastLinkMessage.current),
    [lastJsonMessage]
  )
  const { data: specData } = useSWR(
    lastLinkMessage.current
      ? `https://api.guildwars2.com/v2/specializations/${lastLinkMessage.current.identity.spec}`
      : null
  )
  const { data: mapData } = useSWR(
    lastLinkMessage.current ? `https://api.guildwars2.com/v2/maps/${lastLinkMessage.current.context.map_id}` : null
  )

  const identity = lastLinkMessage.current?.identity
  const context = lastLinkMessage.current?.context

  return (
    <div className="h-full flex flex-col">
      {readyState !== ReadyState.OPEN ? (
        <div className="w-full bg-green-200 sm:pr-2 p-2 pr-16 text-center">
          Download{' '}
          <a className="font-bold hover:underline text-green-800" href="https://www.deltaconnected.com/arcdps/x64/">
            d3d9.dll
          </a>{' '}
          and{' '}
          <a className="font-bold hover:underline text-green-800" href="http://github.com/maael/dessa/releases/latest">
            dessa.dll
          </a>{' '}
          and put them in your GW2 bin64 folder
        </div>
      ) : null}
      <ConnectionStatus title={JSON.stringify(lastLinkMessage)} state={readyState} />
      <div className="bg-gray-800 flex-1 flex flex-col items-center pb-10">
        <div className="title text-6xl mt-5 mb-5">Dessa</div>
        <div className="flex flex-col p-5 items-center text-center">
          <div
            className={classnames('shadow-lg rounded-md bg-blue-900 text-white pr-5 pl-5 pt-2 pb-2 mb-4', {
              'animate-pulse': readyState !== ReadyState.OPEN,
            })}
          >
            {readyState !== ReadyState.OPEN ? (
              'Waiting for connection'
            ) : (
              <>
                Hey {identity?.name}, a {identity ? raceMap[identity.race] : '?'}{' '}
                {specData && specData.elite ? specData.name : ''} {identity ? professionMap[identity.profession] : '?'}
                {context && context.mount_index ? ` on a ${mountMap[context.mount_index]}` : ''}
                {mapData ? ` in ${mapData.name}` : ''}
              </>
            )}
          </div>
          <div className="button">
            Get started <HiArrowCircleRight className="ml-2 text-xl" />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="title text-4xl">What is it?</div>
        </div>
        <div className="flex justify-center items-center mt-2 w-full">
          <div className="w-full grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 place-content-center mr-2 ml-2">
            <div className="md:col-start-2 col-span-3 flex flex-col justify-center items-center text-center shadow-lg rounded-md bg-blue-900 text-white pr-4 pl-4 pt-6 pb-6">
              A tool to help open up all the data about you playing Guild Wars 2, so it can be used to create
              interesting tools that react to what's actually happening in the game.
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="title text-4xl">Tools</div>
          <div className="grid gap-10 md:gap-20 grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 mt-1 place-content-center mr-2 ml-2 md:mr-10 md:ml-10">
            <a href="/map" className="xl:col-start-2 card">
              <div className="card-icon-area">
                <HiEye />
              </div>
              Sightseeing logs, find points in the world from pictures and text clues. New ones released each week, race
              to find them first with live leaderboards.
            </a>
            <a href="/map" className="card">
              <div className="card-icon-area">
                <HiUserGroup />
              </div>
              Fractcal speed clears, track different group compositions and fight against each other on the
              leaderboards, including number of times your team goes downstate.
            </a>
            <a href="/debug/raw" className="card">
              <div className="card-icon-area">
                <HiCog />
              </div>
              Debug tools to help test that Dessa is setup correctly, showing you everything that gets collected. Can be
              helpful if you want to write a tool using dessa too.
            </a>
          </div>
          <div className="button mt-4">
            More tools <HiArrowCircleRight className="ml-2 text-xl" />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mt-5 w-full">
          <div className="title text-4xl">Installation</div>
          <div className="w-full grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 mt-1 place-content-center mr-2 ml-2">
            <div className="md:col-start-2 col-span-3 flex flex-col justify-center items-center text-center shadow-lg rounded-md bg-blue-900 text-white pr-4 pl-4 pt-6 pb-6">
              Some content goes here.
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mt-5 w-full">
          <div className="title text-4xl">FAQs</div>
          <div className="w-full grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 mt-1 place-content-center mr-2 ml-2">
            <div className="md:col-start-2 col-span-3 flex flex-col justify-center items-center text-center shadow-lg rounded-md bg-blue-900 text-white pr-4 pl-4 pt-6 pb-6">
              Some content goes here.
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
