import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'NEXORA | Marketplace B2B, fournisseurs, RFQ et paiements escrow',
  description:
    'Marketplace B2B/B2C pour acheter, vendre, sourcer des fournisseurs, demander des devis, payer en escrow et suivre les livraisons.',
  keywords:
    'Nexora, marketplace, B2B, B2C, fournisseurs, RFQ, escrow, logistique, Congo, RDC',
  authors: [{ name: 'NEXORA' }],
  openGraph: {
    title: 'NEXORA',
    description:
      'Marketplace B2B/B2C avec fournisseurs verifies, RFQ, paiements escrow, logistique et litiges.',
    url: 'https://nexoracd.com',
    siteName: 'NEXORA',
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NEXORA',
    description: 'Marketplace B2B/B2C avec fournisseurs, RFQ, escrow et logistique.',
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
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-sans"
        style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
