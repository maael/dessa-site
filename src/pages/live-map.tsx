import { useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import classnames from 'classnames'
import useWebSocket from 'react-use-websocket'
import ConnectionStatus from '../components/primitives/ConnectionStatus'
import { ObservatoryCharacterData } from '../types/observatory'

const Map = dynamic(async () => import('../components/primitives/LiveMap'), {
  ssr: false,
  loading: () => <p className="h-full w-full flex justify-center items-center text-center">Loading map</p>,
})

export default function Index() {
  const [selected, setSelected] = useState<string>()
  const { lastJsonMessage } = useWebSocket('wss://dessa-observatory.herokuapp.com', {
    reconnectInterval: 5000,
    reconnectAttempts: Infinity,
    shouldReconnect: () => true,
  })
  const lastLinkMessage = useRef<ObservatoryCharacterData[]>([])
  lastLinkMessage.current = useMemo(
    () => (lastJsonMessage ? Object.values(lastJsonMessage) : lastLinkMessage.current),
    [lastJsonMessage]
  )

  return process.browser && typeof window !== 'undefined' ? (
    <div className="flex-1 flex flex-row">
      <div className="w-60">
        {lastLinkMessage.current.map((l) => (
          <div
            key={l.charName}
            className={classnames('p-5 cursor-pointer hover:bg-blue-700', { 'bg-blue-700': l.charName === selected })}
            onClick={() => (l.charName === selected ? setSelected(undefined) : setSelected(l.charName))}
          >
            {l.charName}
          </div>
        ))}
      </div>
      <div className="relative flex-1">
        <div className="absolute top-0 right-0 bottom-0 left-0">
          <Map selected={selected} players={lastLinkMessage.current} />
          <ConnectionStatus title={JSON.stringify(lastLinkMessage)} />
        </div>
      </div>
    </div>
  ) : null
}
