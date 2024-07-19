import { View, Text } from 'react-native'
import React from 'react'
import { ScreenProps, ScrennTypeEnum } from '@/types/screen'

export default function Detail({ navigation }: ScreenProps<ScrennTypeEnum.NodeDetail>) {
  return (
    <View>
      <Text>Detail</Text>
    </View>
  )
}
