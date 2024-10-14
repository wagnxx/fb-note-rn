import { Dimensions, Text, View } from 'react-native'
import React from 'react'
import NoteList from './note-list'
import { ScrennTypeEnum } from '@/types/screen'
import { Note } from '@/service/articles'
const { height } = Dimensions.get('window')

type ItemPressActionType = 'detail' | 'edit'
export type PressItemParams = {
  item: Partial<Note>
  type: ItemPressActionType
}

export default function NodeListScreen({
  list,
  isShowBottomAction,
  onNoteCheckBoxChange,
  navigation,
}) {
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  if (!list?.length) {
    return (
      <View
        style={{
          height,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#000', fontSize: 33 }}>Null data</Text>
      </View>
    )
  }

  const onPressItemHandler = ({ item, type }: PressItemParams) => {
    if (!item || !type) return
    switch (type) {
      case 'detail':
        navigation.navigate(ScrennTypeEnum.NodeDetail, { id: item.id })
        break
      case 'edit':
        navigation.navigate(ScrennTypeEnum.CreateNote, { docId: item.id, id: item.folderId })
        break
    }
  }

  return (
    <View style={{ minHeight: height }}>
      <NoteList
        list={list}
        isEditModel={isShowBottomAction}
        onCheckBoxChange={onNoteCheckBoxChange}
        onPressItem={onPressItemHandler}
      />
    </View>
  )
}
