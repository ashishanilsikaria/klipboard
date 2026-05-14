/** @type {import('next').NextConfig} */
const os = require('os')

function getLocalNetworkHosts() {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((address) => address?.family === 'IPv4' && !address.internal)
    .map((address) => address.address)
}

const nextConfig = {
  allowedDevOrigins: getLocalNetworkHosts(),
  turbopack: {},
}

module.exports = nextConfig
