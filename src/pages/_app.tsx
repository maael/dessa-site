import '../styles/styles.css'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import useFathom from '../components/hooks/useFathom'
import SEO from '../../next-seo.config'
import EmojiFavicon from '../components/primitives/EmojiFavicon'
import DownloadBanner from '../components/primitives/DownloadBanner'
import ConnectionStatus from '../components/primitives/ConnectionStatus'

function App({ Component, pageProps }) {
  useFathom()
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#93C5FD" />
      </Head>
      <DefaultSeo {...SEO} />
      <EmojiFavicon emoji="🔌" />
      <div className="min-h-full flex flex-col bg-gray-800 text-white">
        <DownloadBanner />
        <ConnectionStatus />
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default App
