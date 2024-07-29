/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    baseUrlApi: process.env.NEXT_PUBLIC_BASE_URL_API,
    userActiveStatus: process.env.NEXT_PUBLIC_USER_ACTIVE_STATUS,
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  },
  images: {
    domains: ["localhost", "via.placeholder.com"],
  },
};

export default nextConfig;
