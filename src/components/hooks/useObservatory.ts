import { useMemo, useRef } from 'react'
import useWebSocket from 'react-use-websocket'
import { ObservatoryCharacterData } from '../../types/observatory'

export default function useObservatory() {
  const { lastJsonMessage } = useWebSocket('wss://dessa-observatory.herokuapp.com', {
    reconnectInterval: 5000,
    reconnectAttempts: Infinity,
    shouldReconnect: () => true,
    share: true,
  })
  const lastLinkMessage = useRef<ObservatoryCharacterData[]>([])
  lastLinkMessage.current = useMemo(
    () => (lastJsonMessage ? Object.values(lastJsonMessage) : lastLinkMessage.current),
    [lastJsonMessage]
  )
  return lastLinkMessage.current
}
