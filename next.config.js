/** @type {import('next').NextConfig} */
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = (phase) => {
  const isDevelopment = phase === PHASE_DEVELOPMENT_SERVER;
  const securityHeaders = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' }
  ];

  if (!isDevelopment) {
    securityHeaders.push({
      key: 'Content-Security-Policy',
      value: [
        "default-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "object-src 'none'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "media-src 'self' blob:",
        "connect-src 'self'",
        "font-src 'self' data:",
        "upgrade-insecure-requests"
      ].join('; ')
    });
  }

  return {
    poweredByHeader: false,
    reactStrictMode: true,
    compress: true,
    images: { formats: ['image/avif', 'image/webp'] },
    distDir: isDevelopment ? '.next-dev' : '.next',
    async headers() {
      return [
        {
          source: '/media/:path*',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=2592000' }]
        },
        {
          source: '/vendor/:path*',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
        },
        {
          source: '/app.js',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }]
        },
        { source: '/(.*)', headers: securityHeaders }
      ];
    }
  };
};
