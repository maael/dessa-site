import Link from 'next/link'
import { HiArrowCircleRight } from 'react-icons/hi'
import Spinner from '../components/primitives/Spinner'

export default function Error404() {
  return (
    <div className="flex justify-center items-center flex-1 flex-col pb-8">
      <div className="title text-9xl">404</div>
      <div className="title text-4xl text-center">This page is lost in the mists</div>
      <Spinner />
      <Link href="/">
        <a className="button mt-10">
          Back to the beginning <HiArrowCircleRight className="ml-2 text-xl" />
        </a>
      </Link>
    </div>
  )
}
