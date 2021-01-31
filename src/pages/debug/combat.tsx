import { useMemo, useRef } from 'react'
import useWebSocket from 'react-use-websocket'

export default function Index() {
  const { lastJsonMessage } = useWebSocket('ws://localhost:3012', {
    reconnectInterval: 5000,
    shouldReconnect: () => true,
  })
  const messageHistory = useRef<{ skillname: string; buff: 0 | 1; is_activation: number }[]>([])
  messageHistory.current = useMemo(
    () =>
      lastJsonMessage && lastJsonMessage.type === 'arc'
        ? messageHistory.current.concat(lastJsonMessage)
        : messageHistory.current,
    [lastJsonMessage]
  )

  return (
    <div>
      <div title={JSON.stringify(messageHistory.current[0] || '{}')}>Messages</div>
      <div>
        {messageHistory.current
          .filter((i) => i.buff === 0 && i.is_activation === 1)
          .map((message, idx) => (
            <div key={idx} title={JSON.stringify(message)}>
              {message.skillname}
            </div>
          ))}
      </div>
    </div>
  )
}
