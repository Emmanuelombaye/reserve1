import '../src/index.css'
import { siteUrl } from '../lib/site-data'

const isPreview = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'RSRV',
    template: '%s · RSRV',
  },
  description:
    'Clinician-directed protocols. Compounded in the US, one patient at a time.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'RSRV',
    description: 'Clinician-directed. US-compounded. Tested and verified.',
    url: siteUrl,
    siteName: 'RSRV',
    type: 'website',
    images: [
      {
        url: '/images/hero-home-desktop.webp',
        width: 1600,
        height: 900,
        alt: 'RSRV',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RSRV',
    description: 'Clinician-directed. US-compounded. Tested and verified.',
    images: ['/images/hero-home-desktop.webp'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/favicon-32.png', sizes: '32x32', type: 'image/png' }],
  },
  publisher: 'Reserve Molecular',
  robots: isPreview ? { index: false, follow: true } : { index: true, follow: true },
}

export const viewport = {
  themeColor: '#0B0B0D',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'MedicalBusiness'],
    name: 'RSRV',
    alternateName: 'Reserve Molecular',
    url: siteUrl,
    description:
      'Clinician-directed protocols. Compounded in the US, one patient at a time.',
    medicalSpecialty: 'Telemedicine',
  }

  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        {children}
      </body>
    </html>
  )
}
