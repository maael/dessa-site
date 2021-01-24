import { useMemo, useRef } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

export default function Index() {
  const { readyState, lastJsonMessage } = useWebSocket('ws://localhost:3012', {
    reconnectInterval: 5000,
    shouldReconnect: () => true,
  })
  const messageHistory = useRef<{}[]>([])
  messageHistory.current = useMemo(
    () => (lastJsonMessage === null ? messageHistory.current : messageHistory.current.concat(lastJsonMessage)),
    [lastJsonMessage]
  )

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState]

  return (
    <div>
      <div>Connection: {connectionStatus}</div>
      <div>Messages</div>
      <div>
        {messageHistory.current.map((message, idx) => (
          <div key={idx}>{JSON.stringify(message)}</div>
        ))}
      </div>
    </div>
  )
}
