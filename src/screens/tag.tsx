import { View, Text } from 'react-native'
import React from 'react'
import { ScreenFC, ScrennTypeEnum } from '@/types/screen'

const Tag: ScreenFC<ScrennTypeEnum.Tag> = ({}) => {
  return (
    <View>
      <Text>tag</Text>
    </View>
  )
}
export default Tag
