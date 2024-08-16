/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeIcon, UserIcon } from 'react-native-heroicons/outline'
import Moment from './moment'
import My from './my/my'
import { ScreenFC, ScrennTypeEnum } from '@/types/screen'
import { useTheme } from 'react-native-paper'

const Tab = createBottomTabNavigator()

const HomeTabs: ScreenFC<ScrennTypeEnum.HomeTabs> = ({ navigation, route }) => {
  const theme = useTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        // tabBarActiveBackgroundColor: 'red',
        tabBarActiveBackgroundColor: theme.colors.background,
        tabBarInactiveBackgroundColor: theme.colors.background,
        tabBarActiveTintColor: theme.colors.onBackground,
      }}
    >
      <Tab.Screen
        name={ScrennTypeEnum.Moment}
        component={Moment}
        options={{ tabBarIcon: HomeIcon }}
      />
      <Tab.Screen name={ScrennTypeEnum.My} component={My} options={{ tabBarIcon: UserIcon }} />
    </Tab.Navigator>
  )
}

export default HomeTabs
