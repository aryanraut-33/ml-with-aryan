/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Replace 'domains' with 'remotePatterns' for more flexibility
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' }, // <-- ADD CLOUDINARY
    ],
  },
};

module.exports = nextConfig;