import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { useTheme } from 'react-native-paper'
import { ChevronRightIcon, EyeSlashIcon } from 'react-native-heroicons/outline'
import tw from 'twrnc'
import { developWarn } from '@/utils/utilsAlert'

export default function FolderOtherNav() {
  const theme = useTheme()
  const onPressHandle = () => {
    developWarn()
  }
  return (
    <View style={[tw`bg-white px-2 py-2 mx-2 mt-5 rounded-lg`]}>
      <Pressable
        style={tw`flex-row justify-between  py-2`}
        onPress={onPressHandle}
      >
        <View style={tw`flex-row gap-2`}>
          <EyeSlashIcon size={18} color={theme.colors.onBackground} />
          <Text style={{ color: theme.colors.onBackground }}>隐藏笔记</Text>
        </View>
        <ChevronRightIcon size={18} color={theme.colors.onSurfaceDisabled} />
      </Pressable>
      <Pressable
        style={tw`flex-row justify-between  py-2`}
        onPress={onPressHandle}
      >
        <View style={tw`flex-row gap-2`}>
          <EyeSlashIcon size={18} color={theme.colors.onBackground} />
          <Text style={{ color: theme.colors.onBackground }}>最近删除</Text>
        </View>
        <ChevronRightIcon size={18} color={theme.colors.onSurfaceDisabled} />
      </Pressable>
    </View>
  )
}
