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
import HomeTabs from './src/screens/home-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import Detail from './src/screens/note/detail'

const Stack = createStackNavigator()

function App(): React.JSX.Element {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="HomeTabsScreen" component={HomeTabs} />
          <Stack.Screen name="DetailScreen" component={Detail} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}

export default App
