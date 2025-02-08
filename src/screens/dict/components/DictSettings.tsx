import { View, ViewStyle } from 'react-native'
import React, { FC } from 'react'
import tw from 'twrnc'
import { Text } from 'react-native-paper'
import { TouchableOpacity } from 'react-native-gesture-handler'

export type PageTypes =
  | 'add_dict'
  | 'select_dict'
  | 'word_manage'
  | 'storage_manage'
  | 'word_root'
  | null

const DictSettings: FC<{ setPageType: (val: PageTypes) => void; style: ViewStyle }> = ({
  setPageType,
  style,
}) => {
  const onButtonPress = (tye: PageTypes) => {
    setPageType(tye)
  }

  const items: { title: string; name: PageTypes }[] = [
    { title: 'Select dict', name: 'select_dict' },
    { title: 'Word Manage', name: 'word_manage' },
    { title: 'Storage Manage', name: 'storage_manage' },
    { title: 'Word Root', name: 'word_root' },
  ]

  return (
    <View style={[tw`justify-start py-2 px-2 gap-4`, style]}>
      {items.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => onButtonPress(item.name)}>
          <Text>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default DictSettings
