import HeaderNav from '../../components/primitives/HeaderNav'
import useLink from '../../components/hooks/useLink'
import { useState } from 'react'
import { LinkData } from '../../types/dessa'

export default function SightseeingCapture() {
  const [capturedLinks, setCapturedLinks] = useState<LinkData[]>([])
  const { link } = useLink()
  return (
    <div>
      <HeaderNav />
      <div className="title text-6xl text-center">Sightseeing Capture</div>
      <div className="title text-2xl text-center">
        <a href="/map">Live map →</a>
      </div>
      <div className="flex flex-col justify-center items-center mt-5 w-full pr-2 pl-2 pb-10">
        <button className="button mb-5" onClick={() => setCapturedLinks((l) => l.concat(link as LinkData))}>
          Capture
        </button>
        {capturedLinks.map((i) => (
          <div
            key={i.ui_tick}
            className="w-full mb-5 grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 xl:grid-cols-7 place-content-center mr-2 ml-2"
          >
            <div className="md:col-start-2 xl:col-start-3 col-span-3 flex flex-col justify-center shadow-lg rounded-md bg-blue-900 text-white pr-4 pl-4 pt-6 pb-6">
              {i.identity.name} @ x: {i.context.player_x.toFixed(2)} y: {i.context.player_y.toFixed(2)} avatar:{' '}
              {i.avatar.position.map((j) => j.toFixed(2)).join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
