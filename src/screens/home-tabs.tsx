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
import { useSelector } from 'react-redux'
import { selectAuth } from '@/features/auth/authSlice'
import WrenchScrewdriverIcon from 'react-native-heroicons/outline/WrenchScrewdriverIcon'
import Tool from './tool'
import ToolNavigator from './tool/ToolNavigator'

const Tab = createBottomTabNavigator()

const HomeTabs: ScreenFC<ScrennTypeEnum.HomeTabs> = ({ navigation, route }) => {
  const theme = useTheme()
  const { user } = useSelector(selectAuth)

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
      {/* 左边 tab：Moment（需登录） */}
      {user && (
        <Tab.Screen
          name={ScrennTypeEnum.Moment}
          component={Moment}
          options={{ tabBarIcon: HomeIcon }}
        />
      )}
      {/* 中间 tab：Tool（始终可见） */}
      <Tab.Screen
        name={ScrennTypeEnum.Tool}
        component={ToolNavigator}
        options={{ tabBarIcon: WrenchScrewdriverIcon  }}
      />

      {/* 右边 tab：My（需登录） */}
      {user && (
        <Tab.Screen name={ScrennTypeEnum.My} component={My} options={{ tabBarIcon: UserIcon }} />
      )}
    </Tab.Navigator>
  )
}

export default HomeTabs
