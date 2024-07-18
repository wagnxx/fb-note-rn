/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { FC } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeIcon, TagIcon, UserIcon } from 'react-native-heroicons/outline'
import Moment from './moment'
import Tag from './tag'
import My from './my'
import { ScrennTypeEnum } from '@/types/screen'

const Tab = createBottomTabNavigator()

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name={ScrennTypeEnum.Moment}
        component={Moment}
        options={{ tabBarIcon: HomeIcon }}
      />
      <Tab.Screen
        name="Tag"
        component={Tag}
        options={{ tabBarIcon: TagIcon }}
      />
      <Tab.Screen name="My" component={My} options={{ tabBarIcon: UserIcon }} />
    </Tab.Navigator>
  )
}

export default HomeTabs
