import { View, Text } from 'react-native'
import React from 'react'
import { ScreenProps, ScrennTypeEnum } from '@/types/screen'

export default function NodeDetail({ navigation }: ScreenProps<ScrennTypeEnum.NodeDetail>) {
  return (
    <View>
      <Text>NodeDetail</Text>
    </View>
  )
}
