import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper'
import { MD3Colors, MD3Theme } from 'react-native-paper/lib/typescript/types'
interface CustomMD3Colors extends MD3Colors {
  red: string
  green: string
}

interface CustomMD3Theme extends MD3Theme {
  colors: CustomMD3Colors
}

const LightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: 'rgba(255,255,255,1)', // BackgroundColor
    primary: 'rgba(0,0,0,1)', // AccentColor
    surface: '#f5f5f5',
    onBackground: 'rgba(145,145,145,1)', // SecondaryTextColor
    onPrimary: 'rgba(255,255,255,1)', // Light text on primary (usually inverse of background)
    onSurface: 'rgba(0,0,0,1)', // Text color on surface
    green: 'rgba(0,143,0,1)', // GreenColor
    red: 'rgba(148,22,81,1)', // RedColor
  },
}

const DarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: 'rgba(0,0,0,1)', // BackgroundColor
    primary: 'rgba(250,207,252,1)', // AccentColor
    surface: '#121212',
    onBackground: 'rgba(192,192,192,1)', // SecondaryTextColor
    onPrimary: 'rgba(0,0,0,1)', // Dark text on primary (inverse of light background)
    onSurface: 'rgba(255,255,255,1)', // Text color on surface
    green: 'rgba(115,250,121,1)', // GreenColor
    red: 'rgba(255,47,146,1)', // RedColor
  },
}

export { LightTheme, DarkTheme, type CustomMD3Theme }
