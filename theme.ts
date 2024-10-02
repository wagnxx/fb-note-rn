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
    secondary: 'rgba(145,145,145,0.5)', // 轻微降级的 onBackground
    onSecondary: 'rgba(0,0,0,1)', // 与 onSurface 一致
    surface: '#f5f5f5',
    onBackground: 'rgba(145,145,145,1)', // SecondaryTextColor
    onPrimary: 'rgba(255,255,255,1)', // Light text on primary
    onSurface: 'rgba(0,0,0,1)', // Text color on surface
    secondaryContainer: 'rgba(237,231,246,1)', // 项目背景色
    onSecondaryContainer: 'rgba(51,51,51,1)', // 主文本颜色
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
    secondary: 'rgba(192,192,192,0.5)', // 轻微降级的 onBackground
    onSecondary: 'rgba(255,255,255,1)', // 与 onSurface 一致
    surface: '#121212',
    onBackground: 'rgba(192,192,192,1)', // SecondaryTextColor
    onPrimary: 'rgba(0,0,0,1)', // Dark text on primary
    onSurface: 'rgba(255,255,255,1)', // Text color on surface
    secondaryContainer: 'rgba(18,18,18,1)', // 项目背景色
    onSecondaryContainer: 'rgba(255,255,255,1)', // 主文本颜色
    green: 'rgba(115,250,121,1)', // GreenColor
    red: 'rgba(255,47,146,1)', // RedColor
  },
}

export { LightTheme, DarkTheme, type CustomMD3Theme }
