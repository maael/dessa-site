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
      <div className="title text-4xl md:text-6xl text-center">Sightseeing Capture</div>
      <div className="title text-2xl text-center">
        <a href="/map">Live map →</a>
      </div>
      <div className="w-full mb-5 grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 xl:grid-cols-7 place-content-center">
        <div className="md:col-start-2 xl:col-start-3 col-span-3 flex gap-2 flex-col justify-center shadow-lg rounded-md bg-blue-900 text-white pr-4 pl-4 pt-6 pb-6">
          <div className="flex gap-2 items-center">
            <p className="bg-blue-400 p-1 rounded-md w-24 text-center">Title</p>
            <input
              placeholder="Title..."
              className="p-2 bg-blue-300 rounded-md flex-1 overflow-ellipsis placeholder-black text-black"
            />
          </div>
          <div className="flex gap-2 items-center">
            <p className="bg-blue-400 p-1 rounded-md w-24 text-center">Description</p>
            <input
              placeholder="Description..."
              className="p-2 bg-blue-300 rounded-md flex-1 overflow-ellipsis placeholder-black text-black"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mt-5 w-full pr-2 pl-2 pb-10">
        <button
          className="button mb-5"
          onClick={() =>
            setCapturedLinks((l) =>
              l.concat(
                link ||
                  (({
                    ui_tick: Math.max(Math.max(...l.map((i) => i.ui_tick)), 0) + 1,
                    context: {
                      player_x: 0,
                      player_y: 0,
                    },
                    avatar: {
                      position: [0, 0, 0],
                    },
                    identity: {
                      name: 'Syaoranli',
                    },
                  } as unknown) as LinkData)
              )
            )
          }
        >
          Capture
        </button>
        {capturedLinks.map((i, idx) => (
          <div
            key={i.ui_tick}
            className="w-full mb-5 grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 xl:grid-cols-7 place-content-center mr-2 ml-2"
          >
            <div className="md:col-start-2 xl:col-start-3 col-span-3 flex gap-2 flex-col justify-center shadow-lg rounded-md bg-blue-900 text-white p-4">
              <div>
                <div className="flex flex-row gap-2 items-center">
                  <p className="bg-blue-400 p-1 rounded-full float-right w-8 text-center">{idx + 1}</p>
                  <small className="bg-blue-400 p-1 rounded-md float-right">{i.identity.name}</small>
                  <input
                    placeholder="xy"
                    disabled
                    value={`${i.context.player_x.toFixed(2)}, ${i.context.player_y.toFixed(2)}`}
                    className="p-2 bg-blue-400 rounded-md flex-1 overflow-ellipsis placeholder-black text-black"
                  />
                  <input
                    placeholder="avatar"
                    disabled
                    value={i.avatar.position.map((j) => j.toFixed(2)).join(', ')}
                    className="p-2 bg-blue-400 rounded-md flex-1 overflow-ellipsis placeholder-black text-black"
                  />
                </div>
              </div>
              <div>
                <input
                  placeholder="Hint..."
                  className="p-2 bg-blue-300 rounded-md w-full overflow-ellipsis placeholder-black text-black"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
