import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { MotionProvider } from '@/components/motion';
import './globals.css';

const SITE_URL = 'https://1allenlu.github.io';
const DESCRIPTION = 'Full-Stack Engineer · Backend Engineer · Machine Learning Engineer.';
const IMAGE = '/assets/homepage/profile-pic-web.jpg';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Allen Lu',
  description: 'Allen Lu, M.Eng. Computer Science at Cornell Tech, building full-stack, backend, and ML-driven products.',
  alternates: { canonical: '/' },
  icons: { icon: '/assets/homepage/favicon.svg', other: [{ rel: 'alternate icon', url: '/assets/homepage/favicon.jpg' }] },
  openGraph: { title: 'Allen Lu', description: DESCRIPTION, type: 'website', url: SITE_URL, images: [IMAGE] },
  twitter: { card: 'summary_large_image', title: 'Allen Lu', description: DESCRIPTION, images: [IMAGE] },
};

// Applies the saved (or system) theme before first paint, so there's no flash
// of the wrong theme.
const THEME_SCRIPT = `(function () {
  try {
    var saved = localStorage.getItem('theme');
    var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();`;

const ANALYTICS_SCRIPT = `window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-X15HSK275Z');`;

// Motion hides content until it animates in, so show everything if scripts are off.
const NO_SCRIPT_STYLES = `[style*="opacity:0"] { opacity: 1 !important; transform: none !important; }`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: NO_SCRIPT_STYLES }} />
        </noscript>
        {/* tokens.css is shared with the static gallery page in public/ */}
        <link rel="stylesheet" href="/tokens.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-X15HSK275Z" strategy="afterInteractive" />
        <Script id="analytics" strategy="afterInteractive">
          {ANALYTICS_SCRIPT}
        </Script>
      </body>
    </html>
  );
}
