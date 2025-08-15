/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output to fix JavaScript loading issues
  // output: 'standalone',
  images: {
    unoptimized: true
  }
}

export default nextConfig
