import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper'

const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: '#ffffff',
    primary: '#6200ee',
    accent: '#03dac4',
    surface: '#f5f5f5',
    onBackground: '#000000',
    onPrimary: '#000000',
    onAccent: '#000000',
    onSurface: '#000000',
  },
}

const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: '#000000',
    primary: '#bb86fc',
    accent: '#03dac6',
    surface: '#121212',
    onBackground: '#555',
    onPrimary: 'rgba(0.980, 0.812, 0.988, 1)',
    onAccent: '#1a1717',
    onSurface: '#ffffff',
  },
}

export { LightTheme, DarkTheme }
