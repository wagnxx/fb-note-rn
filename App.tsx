/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { Text } from 'react-native'

const Home = () => <Text>home</Text>
const About = () => <Text>about</Text>

const Tab = createBottomTabNavigator()

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="home" component={Home} />
        <Tab.Screen name="about" component={About} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default App
