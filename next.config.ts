/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone', // Temporarily disabled to fix build issues
  // trailingSlash: true, // Temporarily disabled to fix routing
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
