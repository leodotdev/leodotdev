/** @type {import('next').NextConfig} */
const nextConfig = { 
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
                port: '',
            },
        ],
    },
    async redirects() {
        return [
          {
            source: '/',
            destination: '/projects',
            permanent: true, // Set to false if the redirect is temporary
          },
        ];
      },
}

module.exports = nextConfig
