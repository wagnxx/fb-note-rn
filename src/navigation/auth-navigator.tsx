import { View } from 'react-native'
import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import HomeTabs from '@/screens/home-tabs'
import LoginScreen from '@/screens/login'
import NodeDetail from '@/components/node-detail'
import { AuthContext } from '@/context/auth-provider'
import { ActivityIndicator, useTheme } from 'react-native-paper'
import tw from 'twrnc'
import { ScrennTypeEnum } from '@/types/screen'
import Profile from '@/screens/my/profile'

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
          <Stack.Screen name={ScrennTypeEnum.HomeTabs} component={HomeTabs} />
          <Stack.Screen name={ScrennTypeEnum.NodeDetail} component={NodeDetail} />
          <Stack.Screen name={ScrennTypeEnum.Profile} component={Profile} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  )
}
