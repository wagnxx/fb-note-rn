module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['react-native-worklets-core/plugin'], // 确保这行存在

    [
      'react-native-reanimated/plugin',
      // {
      //   globals: ['__scanCodes'],
      // },
    ],
  ],
}
