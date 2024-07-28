import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import NoteList from './note-list'
import { ScrennTypeEnum } from '@/types/screen'

export default function NodeListScreen({ list, isShowBottomAction, onNoteCheckBoxChange, navigation }) {
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  if (!list?.length) {
    return <Text>Null data</Text>
  }
  return (
    <View style={tw`flex-1 p-2`}>
      <ScrollView contentContainerStyle={[{}, tw`bg-gray-100`]} showsVerticalScrollIndicator={true}>
        <NoteList
          list={list}
          showCheckBox={isShowBottomAction}
          onCheckBoxChange={onNoteCheckBoxChange}
          onPressItem={item => navigation.navigate(ScrennTypeEnum.NodeDetail, { id: item.id })}
        />
      </ScrollView>
    </View>
  )
}
