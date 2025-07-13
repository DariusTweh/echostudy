const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 🛑 Disables the use of package.json "exports" field
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
