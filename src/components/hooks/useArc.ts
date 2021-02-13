import { useMemo, useRef } from 'react'
import useWebSocket from 'react-use-websocket'

export default function useArc() {
  const { lastJsonMessage } = useWebSocket('ws://localhost:3012', {
    reconnectInterval: 5000,
    reconnectAttempts: Infinity,
    shouldReconnect: () => true,
    share: true,
  })
  const messageHistory = useRef<{ skillname: string; buff: 0 | 1; is_activation: number; skillid?: number }[]>([])
  messageHistory.current = useMemo(
    () =>
      lastJsonMessage && lastJsonMessage.type === 'arc'
        ? messageHistory.current.concat(lastJsonMessage)
        : messageHistory.current,
    [lastJsonMessage]
  )
  return messageHistory.current
}
