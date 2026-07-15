import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" data-theme="light">
      <Head>
        <link rel="icon" href="/media/logo.png" />
        <link rel="stylesheet" href="/final.css?v=20260715-nav-outline-v23" />
      </Head>
      <body className="interface-redesign cinematic-redesign minimal-premium">
        <Main />
        <NextScript />
        <script defer src="/vendor/gsap.min.js?v=3.15.0" />
        <script defer src="/vendor/ScrollTrigger.min.js?v=3.15.0" />
        <script defer src="/vendor/lenis.min.js?v=1.3.25" />
        <script defer src="/app.js?v=20260715-hero-layout-v22" />
      </body>
    </Html>
  );
}
