import { useMemo, useRef } from 'react'
import useWebSocket from 'react-use-websocket'

export default function Index() {
  const { lastJsonMessage } = useWebSocket('ws://localhost:3012', {
    reconnectInterval: 5000,
    shouldReconnect: () => true,
  })
  const messageHistory = useRef<{}[]>([])
  messageHistory.current = useMemo(
    () => (lastJsonMessage === null ? messageHistory.current : messageHistory.current.concat(lastJsonMessage)),
    [lastJsonMessage]
  )

  return (
    <div>
      <div>Messages</div>
      <div>
        {messageHistory.current.map((message, idx) => (
          <div key={idx}>{JSON.stringify(message)}</div>
        ))}
      </div>
    </div>
  )
}
