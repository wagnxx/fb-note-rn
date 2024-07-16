/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { Text, View } from 'react-native'
import { HomeIcon, TagIcon, UserIcon } from 'react-native-heroicons/outline'

import tw from 'twrnc'
import Moment from './src/screens/moment'
import Tag from './src/screens/tag'
import My from './src/screens/my'

const Home = () => (
  <View style={tw`justify-center flex-1 items-center`}>
    <Text>home</Text>
  </View>
)
const About = () => <Text>about</Text>

const Tab = createBottomTabNavigator()

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="moment"
          component={Moment}
          options={{ tabBarIcon: HomeIcon }}
        />
        <Tab.Screen
          name="tag"
          component={Tag}
          options={{ tabBarIcon: TagIcon }}
        />
        <Tab.Screen
          name="my"
          component={My}
          options={{ tabBarIcon: UserIcon }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default App
