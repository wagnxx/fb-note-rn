const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const path = require('path')

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  // transformer: {
  //   // 其他配置...
  //   sourceMap: true,
  // },
  resolver: {
    extraNodeModules: {
      '@': path.resolve(__dirname, 'src'),
      '@env': path.resolve(__dirname, './.env'),
    },
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'd.ts'],
  },
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config)
