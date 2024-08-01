import { View } from 'react-native'
import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeTabs from '@/screens/home-tabs'
import LoginScreen from '@/screens/login'
import NodeDetail from '@/screens/note/detail'
import { AuthContext } from '@/context/auth-provider'
import { ActivityIndicator, useTheme } from 'react-native-paper'
import tw from 'twrnc'
import { ScrennTypeEnum } from '@/types/screen'
import Profile from '@/screens/my/profile'
import CreateNote from '@/screens/note/create'
import Photo from '@/screens/my/photo'
import Music from '@/screens/my/music'

const Stack = createStackNavigator()

export default function AuthNavigator() {
  const theme = useTheme()
  const { user, loadingUser } = useContext(AuthContext)

  if (loadingUser) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color={theme.colors.outline} />
      </View>
    )
  }

  return (
    <Stack.Navigator
      initialRouteName="HomeTabs"
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        <>
          {/* 首页带有 bottom tabs screen */}
          <Stack.Screen name={ScrennTypeEnum.HomeTabs} component={HomeTabs} />
          {/* 普通 Stack.Screen 需要登录 */}
          <Stack.Screen
            name={ScrennTypeEnum.NodeDetail}
            component={NodeDetail}
          />
          <Stack.Screen name={ScrennTypeEnum.Profile} component={Profile} />
          <Stack.Screen
            name={ScrennTypeEnum.CreateNote}
            component={CreateNote}
          />
          <Stack.Screen name={ScrennTypeEnum.Photo} component={Photo} />
          <Stack.Screen name={ScrennTypeEnum.Music} component={Music} />
        </>
      ) : (
        // 不需要登录的 游客可访问页面
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  )
}
