import Link from 'next/link'
import useLink from '../../components/hooks/useLink'
import HeaderNav from '../../components/primitives/HeaderNav'

export default function Index() {
  const { link } = useLink()

  return (
    <div>
      <HeaderNav />
      <div className="title text-center text-4xl">{link?.identity.name} Debug Info</div>
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
      <code>
        <pre>{JSON.stringify(link, undefined, 2)}</pre>
      </code>
    </div>
  )
}
