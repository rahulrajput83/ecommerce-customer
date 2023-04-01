/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    JWT: process.env.JWT,
    FRONTEND: process.env.FRONTEND
  }
}

module.exports = nextConfig
