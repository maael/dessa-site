import { useMemo, useRef } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import useSWR from 'swr'
import { professionMap, mountMap, raceMap } from '../../data/link'
import ConnectionStatus from '../components/primitives/ConnectionStatus'
import { LinkData } from '../types'

export default function Index() {
  const { readyState, lastJsonMessage } = useWebSocket('ws://localhost:3012', {
    reconnectInterval: 5000,
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
        <div className="w-full bg-green-200 sm:pr-2 p-2 pr-16 text-center" style={{ zIndex: -1 }}>
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
      <div className="flex justify-center items-center flex-1 text-center">
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
    </div>
  )
}
