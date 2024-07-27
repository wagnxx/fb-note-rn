import { View, Text } from 'react-native'
import React from 'react'
import { useTheme } from 'react-native-paper'
import { ArrowRightIcon, EyeSlashIcon } from 'react-native-heroicons/outline'
import tw from 'twrnc'

export default function FolderOtherNav() {
  const theme = useTheme()
  return (
    <View style={[tw`bg-white px-2 py-2 mx-2 mt-5 rounded-lg`]}>
      <View style={tw`flex-row justify-between`}>
        <View style={tw`flex-row gap-2`}>
          <EyeSlashIcon size={18} color={theme.colors.onBackground} />
          <Text style={{ color: theme.colors.onBackground }}>隐藏笔记</Text>
        </View>
        <ArrowRightIcon size={18} color={theme.colors.onSurfaceDisabled} />
      </View>
      <View style={tw`flex-row justify-between mt-4`}>
        <View style={tw`flex-row gap-2`}>
          <EyeSlashIcon size={18} color={theme.colors.onBackground} />
          <Text style={{ color: theme.colors.onBackground }}>最近删除</Text>
        </View>
        <ArrowRightIcon size={18} color={theme.colors.onSurfaceDisabled} />
      </View>
    </View>
  )
}
