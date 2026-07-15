/** @type {import('next').NextConfig} */
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = (phase) => ({
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next'
});
