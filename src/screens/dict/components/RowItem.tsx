import { WordItem } from '@/features/dict/dictSlice'
import React, { FC } from 'react'
import { View, Text } from 'react-native'
import tw from 'twrnc'

const RowItem: FC<{ item: WordItem }> = ({ item }) => {
  return (
    <View style={[tw`gap-2`]}>
      <Text>{item.name}</Text>
      <View style={[tw`flex-row gap-4`]}>
        <Text>UK /{item.ukphone}/</Text>
        <Text>US /{item.usphone}/</Text>
      </View>
      <Text>{item.trans.toLocaleString()}</Text>
    </View>
  )
}

export default RowItem
