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
import NodeDetail from './src/screens/note/detail'
import LoginScreen from './src/screens/login'

const Stack = createStackNavigator()

function App(): React.JSX.Element {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="HomeTabs"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="HomeTabs" component={HomeTabs} />
          <Stack.Screen name="NodeDetail" component={NodeDetail} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}

export default App
