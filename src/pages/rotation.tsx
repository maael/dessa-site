import { useEffect, useState } from 'react'
import Image from 'next/image'
import classnames from 'classnames'
import useSWR from 'swr'
import HeaderNav from '../components/primitives/HeaderNav'
import { professionMap } from '../../data/link'
import useArc from '../components/hooks/useArc'

export default function Rotation() {
  const [profession, setProfession] = useState<string>()
  const combatLog = useArc()
  const activedSkills = combatLog.filter((l) => l.is_activation === 1)
  const { data: profData } = useSWR(profession ? `https://api.guildwars2.com/v2/professions/${profession}` : null)
  const skillsList = (profData && profData.skills ? profData.skills : [])
    .map(({ id }) => id)
    .concat(
      Object.values(profData && profData.weapons ? profData.weapons : {}).map(({ skills }) =>
        skills.map(({ id }) => id)
      )
    )
    .join(',')
  const { data: skillsData } = useSWR(skillsList ? `https://api.guildwars2.com/v2/skills?ids=${skillsList}` : null)
  const [rotation, setRotation] = useState<any>([])
  useEffect(() => {
    setRotation([])
  }, [profession])
  return (
    <div className="flex flex-1 items-center flex-col">
      <HeaderNav />
      <div className="title text-6xl mt-5">Rotation Practicer</div>
      <div className="flex items-center justify-center gap-3 flex-wrap mt-5">
        {Object.values(professionMap).map((p) => (
          <div
            key={p}
            className={classnames('rounded-full ring-1 pr-5 pl-5 cursor-pointer select-none', {
              'bg-blue-400': p === profession,
            })}
            onClick={() => (profession === p ? setProfession(undefined) : setProfession(p))}
          >
            {p}
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-center items-center flex-wrap gap-1">
        {(skillsData || []).map((s) => (
          <Image
            key={s.id}
            title={s.name}
            src={s.icon}
            height={50}
            width={50}
            onClick={() => setRotation((r) => r.concat(s))}
            className="cursor-pointer"
          />
        ))}
      </div>
      <div className="flex flex-col md:flex-row w-full">
        <div className="flex-1">
          <div className="title text-4xl mt-5 text-center">Actual</div>
          <div className="flex flex-col gap-2">
            {activedSkills.map((r, i) => (
              <div key={i} className="flex-1 flex justify-center items-center space-x-2">
                {(skillsData || []).find(({ id }) => id === r.skillid) ? (
                  <Image
                    title={r.skillname}
                    src={(skillsData || []).find(({ id }) => id === r.skillid).icon}
                    height={30}
                    width={30}
                  />
                ) : null}
                <div>{r.skillname}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="title text-4xl mt-5 text-center">Rotation</div>
          <div className="flex flex-col gap-2">
            {rotation.map((r) => (
              <div key={r.id} className="flex-1 flex justify-center items-center space-x-2">
                <Image title={r.name} src={r.icon} height={30} width={30} />
                <div>{r.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
