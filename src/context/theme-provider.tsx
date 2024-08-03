import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  FC,
  useEffect,
  useMemo,
} from 'react'
import { Provider as PaperProvider } from 'react-native-paper'

import { DarkTheme, LightTheme } from '../../theme'
import { Appearance } from 'react-native'

type ThemeName = 'light' | 'dark' | 'sys'

type ThemePaperProviderType = {
  isDarkMode: boolean
  appTheme: ThemeName
  setAppTheme: (theme: ThemeName) => void
  themeList: ThemeName[]
}

const ThemePaperContext = createContext<ThemePaperProviderType>({
  isDarkMode: false,
  appTheme: 'sys',
  setAppTheme: () => {},
  themeList: ['light', 'dark', 'sys'],
})

export const ThemePaperProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const themeList: ThemeName[] = ['light', 'dark', 'sys']
  const [appTheme, setAppTheme] = useState<ThemeName>('sys')
  console.log('Appearance.getColorScheme():::', Appearance.getColorScheme())

  const isDarkMode = useMemo(() => {
    return (
      appTheme === 'dark' ||
      (appTheme === 'sys' && Appearance.getColorScheme() === 'dark')
    )
  }, [appTheme])

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      console.log('colorScheme changed to:', colorScheme)
      if (appTheme === 'sys') {
        setAppTheme(colorScheme || 'light')
      }
    })

    return () => subscription.remove()
  }, [appTheme])

  const value = {
    isDarkMode,
    appTheme,
    setAppTheme,
    themeList,
  }

  return (
    <ThemePaperContext.Provider value={value}>
      <PaperProvider theme={isDarkMode ? DarkTheme : LightTheme}>
        {children}
      </PaperProvider>
    </ThemePaperContext.Provider>
  )
}

export const useThemePaper = () => useContext(ThemePaperContext)
