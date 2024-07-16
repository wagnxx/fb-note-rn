// theme.js
import { DefaultTheme } from 'react-native-paper'

const fontSizes = {
  small: 12,
  medium: 16,
  large: 24,
}

const colors = {
  ...DefaultTheme.colors,
  // primary: '#6200ee',
  // accent: '#03dac4',
  // background: '#f6f6f6',
  // textSecondary: '#585b58',
  // textMain: '#929497',
}

const theme = {
  ...DefaultTheme,
  colors,
  fontSizes,
}

export default theme
