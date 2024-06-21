/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    
    
    // swcPlugins: [["next-superjson-plugin", {}]],
  },

  images: {
    domains: [
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "res.cloudinary.com",
      "img.clerk.com",
    ],
  },
};

module.exports = nextConfig;
