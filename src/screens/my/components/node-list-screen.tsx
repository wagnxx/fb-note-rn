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
    return <Text>Null data</Text>
  }
  // return (
  //   <View style={tw`flex-1 p-2`}>
  //     <NoteList
  //       list={list}
  //       showCheckBox={isShowBottomAction}
  //       onCheckBoxChange={onNoteCheckBoxChange}
  //       onPressItem={item =>
  //         navigation.navigate(ScrennTypeEnum.NodeDetail, { id: item.id })
  //       }
  //     />
  //   </View>
  // )

  return (
    // <View style={{ backgroundColor: 'red', height: 4444 }} />
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
