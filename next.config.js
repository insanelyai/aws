/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["awsclouded.s3.us-east-1.amazonaws.com"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "http://18.215.226.190:3000",
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
  allowedDevOrigins: ["http://18.215.226.190:3000"],
};

module.exports = nextConfig;
