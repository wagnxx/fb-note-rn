/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeIcon, TagIcon, UserIcon } from 'react-native-heroicons/outline'
import Moment from './moment'
import Tag from './tag'
import My from './my'

const Tab = createBottomTabNavigator()

function HomeTabs(): React.JSX.Element {
  return (
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
      <Tab.Screen name="my" component={My} options={{ tabBarIcon: UserIcon }} />
    </Tab.Navigator>
  )
}

export default HomeTabs
