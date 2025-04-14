/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "awsclouded.s3.us-east-1.amazonaws.com",
        pathname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "http://18.215.226.190:3000", // Or "*" if you want to allow all origins (not recommended in prod)
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
  // Optional: use this only in dev mode if needed
  allowedDevOrigins: ["http://18.215.226.190:3000"],
};

module.exports = nextConfig;
