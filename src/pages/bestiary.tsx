import { useMemo } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import useLocalStorage, { Keys } from '../components/hooks/useLocalStorage'
import useArcTemporary from '../components/hooks/useArcTemporary'
import HeaderNav from '../components/primitives/HeaderNav'

type Bestiary = {
  level: string[]
  location: string[]
  race?: string[]
  requires?: string[]
  pageid: number
  ns: number
  title: string
  imageUrl?: string
}[]

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bestiaryData: Bestiary = require('../../data/bestiary-full.json')
const bestiaryMap = new Map(bestiaryData.map((b) => [b.title, b]))

const requireMap = {
  hot: 'HoT',
  pof: 'PoF',
  lws5: 'LW S5',
  lws4: 'LW S4',
  lws3: 'LW S3',
  lws2: 'LW S2',
  lws1: 'LW S1',
}

const colorMap = {
  default: 'bg-blue-400',
  hot: 'bg-green-600',
  pof: 'bg-red-600',
}

export default function Bestiary() {
  const [found, setFound] = useLocalStorage<number[]>(Keys.FoundBestiary, [])
  useArcTemporary((msg) => {
    try {
      const data = JSON.parse(msg.data)
      const agName = data.ag_name
      const beast = bestiaryMap.get(agName)
      if (!beast) return
      setFound((f) => [...new Set((f || []).concat(beast.pageid))])
    } catch (e) {
      console.error(e)
    }
  })
  const foundMap = useMemo(() => new Set(found || ([] as any)), [found])
  return (
    <div>
      <HeaderNav />
      <div className="title text-4xl md:text-6xl text-center">Bestiary</div>
      <div className="flex justify-center items-center mt-6 w-full">
        <div className="w-full grid gap-10 md:gap-20 grid-cols-1 md:grid-cols-5 xl:grid-cols-6 place-content-center mx-2">
          <div className="md:col-start-2 xl:col-start-3 col-span-3 xl:col-span-2 flex flex-col justify-center items-center text-center shadow-lg rounded-md bg-blue-900 text-white px-4 py-8">
            <p className="text-xl font-bold">
              Below is a list of enemies in the game. Once you have Dessa set up, they will be ticked off when you enter
              into combat with them. There's a few spoilers in here too, so be careful of that.
            </p>
          </div>
        </div>
      </div>
      <div className="title text-2xl md:text-4xl text-center">
        Encountered {foundMap.size} / {bestiaryData.length}
      </div>
      <div className="grid grid-cols-4 gap-5 p-10 w-full md:w-3/4 mx-auto">
        {bestiaryData.map(({ title, pageid, race, level, location, requires }) => {
          return (
            <div key={pageid} className="bg-blue-800 p-5 rounded-md shadow-lg relative overflow-hidden">
              <div className="flex flex-row">
                <h2 className="flex-1">{title}</h2>
                <div className="flex flex-row gap-2">
                  {requires
                    ?.flatMap((r) => r.split(','))
                    .map((r) => (
                      <div key={r} className={`text-xs rounded-sm px-2 py-1 ${colorMap[r] || colorMap.default}`}>
                        {requireMap[r.trim().toLowerCase()] || r}
                      </div>
                    ))}
                </div>
              </div>
              <p>
                {level ? `Level ${level?.join(', ')} ` : null}
                {race?.join(', ')}
              </p>
              {location ? <p>Location Hints: {location?.join(', ')}</p> : null}
              {foundMap.has(pageid) ? (
                <div className="absolute top-0 right-0 left-0 bottom-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
                  <FaCheckCircle size={50} />
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
