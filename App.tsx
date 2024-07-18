/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Provider as PaperProvider } from 'react-native-paper'

import theme from './theme'
import { AuthProvider } from './src/context/auth-provider'
import AuthNavigator from './src/navigation/auth-navigator'

function App(): React.JSX.Element {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <NavigationContainer>
          <AuthNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  )
}

export default App
