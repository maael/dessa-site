import { useMemo, useRef } from 'react'
import useWebSocket from 'react-use-websocket'
import ConnectionStatus from '../../components/primitives/ConnectionStatus'

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

  return (
    <div>
      <div>
        Connection: <ConnectionStatus state={readyState} />
      </div>
      <div>Hey {lastLinkMessage.current.identity?.name}</div>
      <div>Messages</div>
      <div>{JSON.stringify(lastLinkMessage.current)}</div>
    </div>
  )
}
