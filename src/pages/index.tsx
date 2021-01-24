import { useMemo, useRef } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import useSWR from 'swr'
import { professionMap, mountMap, raceMap } from '../../data/link'
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

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]

  const identity = lastLinkMessage.current?.identity
  const context = lastLinkMessage.current?.context

  return (
    <div>
      <div>
        Download <a href="http://github.com/maael/dessa/releases/latest">dessa.dll</a> and put it in your GW2 bin64
        folder
      </div>
      <div title={JSON.stringify(lastLinkMessage)}>Connection: {connectionStatus}</div>
      <div>
        Hey {identity?.name}, a {identity ? raceMap[identity.race] : '?'}{' '}
        {specData && specData.elite ? specData.name : ''} {identity ? professionMap[identity.profession] : '?'}
        {context && context.mount_index ? ` on a ${mountMap[context.mount_index]}` : ''}
        {mapData ? ` in ${mapData.name}` : ''}
      </div>
    </div>
  )
}
