/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    JWT: process.env.JWT,
  }
}

module.exports = nextConfig
