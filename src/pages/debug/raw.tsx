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
  const messageHistory = useRef<any[]>([])
  messageHistory.current = useMemo(
    () => (lastJsonMessage === null ? messageHistory.current : messageHistory.current.concat(lastJsonMessage)),
    [lastJsonMessage]
  )

  return (
    <div>
      <HeaderNav />
      <div className="title text-center text-4xl">Raw Debug Messages</div>
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
        {messageHistory.current.map((message, idx) => (
          <div key={idx} className={classnames({ 'bg-blue-700': idx % 2 === 0 }, 'p-5')}>
            {JSON.stringify(message, undefined, 2)}
          </div>
        ))}
      </div>
    </div>
  )
}
