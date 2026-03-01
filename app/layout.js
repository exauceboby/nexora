import './globals.css';

export const metadata = {
  title: 'NEXORA Technologies & Networks | Starlink, Réseaux & IT',
  description: 'Solutions de connectivité premium : installations Starlink, réseaux LAN/Wi-Fi, hotspots MikroTik, développement web/mobile en RDC et Afrique.',
  keywords: 'Starlink, RDC, Congo, réseaux, WiFi, MikroTik, hotspot, IT, développement web',
  authors: [{ name: 'NEXORA NTN' }],
  openGraph: {
    title: 'NEXORA Technologies & Networks',
    description: 'Connectivité & Solutions IT Premium en Afrique',
    url: 'https://nexora.cd',
    siteName: 'NEXORA NTN',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXORA Technologies & Networks',
    description: 'Connectivité & Solutions IT Premium en Afrique',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
