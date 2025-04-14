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
            value:
              process.env.NODE_ENV === "development"
                ? "http://18.215.226.190:3000"
                : "http://18.215.226.190:3000", // Replace with your actual domain
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
  experimental: {
    allowedDevOrigins: ["18.215.226.190"],
  },
};

module.exports = nextConfig;
