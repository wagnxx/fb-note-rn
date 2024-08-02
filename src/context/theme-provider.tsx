import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  FC,
} from 'react'
import { Provider as PaperProvider } from 'react-native-paper'

import { DarkTheme, LightTheme } from '../../theme'

type ThemePaperProviderType = {
  setIsDarkMode: (value: boolean) => void
  isDarkMode: boolean
}

const ThemePaperContext = createContext<ThemePaperProviderType>({
  setIsDarkMode: (value: boolean) => {},
  isDarkMode: false,
})

export const ThemePaperProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(true)
  return (
    <ThemePaperContext.Provider value={{ setIsDarkMode, isDarkMode }}>
      <PaperProvider theme={isDarkMode ? DarkTheme : LightTheme}>
        {children}
      </PaperProvider>
    </ThemePaperContext.Provider>
  )
}

export const useThemePaper = () => useContext(ThemePaperContext)
