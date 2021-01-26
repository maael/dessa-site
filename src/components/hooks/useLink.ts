import { useMemo, useRef } from 'react'
import useWebSocket from 'react-use-websocket'
import useSWR from 'swr'
import { professionMap, mountMap, raceMap } from '../../../data/link'
import { LinkData } from '../../types/dessa'
import { ApiMap, ApiSpec } from '../../types/api'

export default function useLink() {
  const { readyState, lastJsonMessage } = useWebSocket('ws://localhost:3012', {
    reconnectInterval: 5000,
    reconnectAttempts: Infinity,
    shouldReconnect: () => true,
    share: true,
    filter: (m) => {
      try {
        const j = JSON.parse(m.data)
        return j.type === 'link'
      } catch {
        return false
      }
    },
  })
  const lastLinkMessage = useRef<LinkData | null>(null)
  lastLinkMessage.current = useMemo(
    () => (lastJsonMessage && lastJsonMessage.type === 'link' ? lastJsonMessage : lastLinkMessage.current),
    [lastJsonMessage]
  )
  const { data: specData } = useSWR<ApiSpec>(
    lastLinkMessage.current
      ? `https://api.guildwars2.com/v2/specializations/${lastLinkMessage.current.identity.spec}`
      : null
  )
  const { data: mapData } = useSWR<ApiMap>(
    lastLinkMessage.current ? `https://api.guildwars2.com/v2/maps/${lastLinkMessage.current.context.map_id}` : null
  )
  return {
    readyState,
    link: lastLinkMessage.current
      ? {
          ...lastLinkMessage.current,
          identity: {
            ...lastLinkMessage.current.identity,
            professionName: professionMap[lastLinkMessage.current.identity.profession],
            raceName: raceMap[lastLinkMessage.current.identity.race],
          },
          context: {
            ...lastLinkMessage.current.context,
            mountName: mountMap[lastLinkMessage.current.context.mount_index],
          },
        }
      : null,
    mapData,
    specData,
  }
}
