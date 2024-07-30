import { Dimensions, Text, View } from 'react-native'
import React from 'react'
import NoteList from './note-list'
import { ScrennTypeEnum } from '@/types/screen'
const { height } = Dimensions.get('window')
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

  return (
    <View style={{ minHeight: height }}>
      <NoteList
        list={list}
        showCheckBox={isShowBottomAction}
        onCheckBoxChange={onNoteCheckBoxChange}
        onPressItem={item =>
          navigation.navigate(ScrennTypeEnum.NodeDetail, { id: item.id })
        }
      />
    </View>
  )
}
