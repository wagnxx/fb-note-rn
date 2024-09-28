import { View, ViewStyle } from 'react-native'
import React, { FC } from 'react'
import tw from 'twrnc'
import { Button } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type PageTypes = 'add_dict' | 'select_dict' | 'word_manage' | null

const DictSettings: FC<{ setPageType: (val: PageTypes) => void; style: ViewStyle }> = ({
  setPageType,
  style,
}) => {
  const onButtonPress = (tye: PageTypes) => {
    setPageType(tye)
  }
  return (
    <View style={[tw`justify-start`, style]}>
      <Button onPress={() => onButtonPress('add_dict')}>Add dict</Button>
      <Button onPress={() => onButtonPress('select_dict')}>Select dict</Button>
      <Button onPress={() => onButtonPress('word_manage')}>Word Manage</Button>
      <Button onPress={() => AsyncStorage.clear()}>clear storage</Button>
    </View>
  )
}

export default DictSettings
