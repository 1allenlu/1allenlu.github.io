import Script from 'next/script';

// The animation lives in public/background-canvas.js, shared with the gallery page.
export function BackgroundCanvas() {
  return (
    <>
      <canvas className="site-canvas" aria-hidden />
      <Script src="/background-canvas.js" strategy="afterInteractive" />
    </>
  );
}
