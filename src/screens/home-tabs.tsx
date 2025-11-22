/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeIcon, UserIcon } from 'react-native-heroicons/outline'
import Moment from './moment'
import { ScreenFC, ScrennTypeEnum } from '@/types/screen'
import { useTheme } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { selectAuth } from '@/features/auth/authSlice'
import WrenchScrewdriverIcon from 'react-native-heroicons/outline/WrenchScrewdriverIcon'
import ToolNavigator from './tool/ToolNavigator'
import Me from './account/me'

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
        options={{ tabBarIcon: WrenchScrewdriverIcon }}
      />

      {/* 右边 tab：Me（不需登录） */}
      <Tab.Screen name={ScrennTypeEnum.Me} component={Me} options={{ tabBarIcon: UserIcon }} />
    </Tab.Navigator>
  )
}

export default HomeTabs
