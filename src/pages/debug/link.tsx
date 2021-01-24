import { useMemo, useRef } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

export default function Index() {
  const { readyState, lastJsonMessage } = useWebSocket('ws://localhost:3012', {
    reconnectInterval: 5000,
    shouldReconnect: () => true,
  })
  const lastLinkMessage = useRef<{ identity?: { name: string } }>({})
  lastLinkMessage.current = useMemo(
    () => (lastJsonMessage && lastJsonMessage.type === 'link' ? lastJsonMessage : lastLinkMessage.current),
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
      <div>Hey {lastLinkMessage.current.identity?.name}</div>
      <div>Messages</div>
      <div>{JSON.stringify(lastLinkMessage.current)}</div>
    </div>
  )
}
