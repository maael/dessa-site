import { useMemo, useRef } from 'react'
import Link from 'next/link'
import useWebSocket from 'react-use-websocket'
import classnames from 'classnames'
import HeaderNav from '../../components/primitives/HeaderNav'

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
      <HeaderNav />
      <div
        title={JSON.stringify(messageHistory.current[0] || '{}', undefined, 2)}
        className="title text-center text-4xl"
      >
        Combat Debug Messages
      </div>
      <div className="title text-center text-2xl pb-5 flex flex-row justify-around">
        <Link href="/debug/raw">
          <a>Raw</a>
        </Link>
        <Link href="/debug/link">
          <a>Link</a>
        </Link>
        <Link href="/debug/combat">
          <a>Combat</a>
        </Link>
      </div>
      <div>
        {messageHistory.current
          .filter((i) => i.buff === 0 && i.is_activation === 1)
          .map((message, idx) => (
            <div
              key={idx}
              className={classnames({ 'bg-blue-700': idx % 2 === 0 }, 'p-5')}
              title={JSON.stringify(message, undefined, 2)}
            >
              {message.skillname}
            </div>
          ))}
      </div>
    </div>
  )
}
