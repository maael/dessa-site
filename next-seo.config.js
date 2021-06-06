const title = 'Dessa | A plugin to open up Guild Wars 2'
const description = 'A plugin to open up Guild Wars 2.'
const url = 'https://dessa.mael.tech/'

module.exports = {
  title,
  description,
  canonical: url,
  openGraph: {
    title,
    description,
    url,
    site_name: title,
    type: 'website',
    locale: 'en_GB',
    images: [{ url: `${url}images/social-preview.png` }],
  },
  twitter: {
    handle: '@mattaelphick',
    site: '@mattaelphick',
    cardType: 'summary_large_image',
  },
}
