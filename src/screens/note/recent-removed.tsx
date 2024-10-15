import { getRecentRemovedNotes, Note, restoreNotes } from '@/service/articles'
import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { useTheme } from 'react-native-paper'
import NoteList from '../my/components/note-list'
import tw from 'twrnc'
import { extractTextFromHTML } from '@/utils/utilsString'
import Toast from 'react-native-toast-message'
import { ArrowLeftIcon, ArrowUturnLeftIcon, PencilSquareIcon } from 'react-native-heroicons/outline'
import { useNavigation } from '@react-navigation/native'
import { messageConfirm } from '@/utils/utilsAlert'

const RecentRemoved = () => {
  const [nodeList, setNodeList] = useState<Partial<Note>[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isEdit, setIsEdit] = useState(false)

  const theme = useTheme()
  const navigation = useNavigation()

  const restoreHandler = () => {
    if (!selectedIds.length) return
    messageConfirm({
      message: `Are you sure to delete  these notes : [${[...selectedIds]}] ?`,
    }).then(() => {
      restoreNotes(selectedIds).then(res => {
        if (res) {
          Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Operation successfuly',
            visibilityTime: 3000,
          })
          refereshPage()
        }
      })
    })
  }

  const refereshPage = () => {
    getRecentRemovedNotes().then(res => {
      console.log('res::::', res)
      if (res) {
        const list = res.map(item => {
          item.titleText = extractTextFromHTML(item.title)
          return item
        })
        setNodeList(list)
      }
    })
  }

  useEffect(() => {
    refereshPage()
  }, [])

  const onPressItemHandler = item => {
    console.log(item)
  }
  return (
    <View style={[tw`p-2`, { backgroundColor: theme.colors.background }]}>
      <View style={[tw`py-2 flex-row justify-end gap-6`]}>
        <View style={[tw`flex-auto justify-start`]}>
          <ArrowLeftIcon
            size={22}
            color={theme.colors.onBackground}
            onPress={() => navigation.goBack()}
          />
        </View>
        {isEdit && selectedIds?.length > 0 && (
          <ArrowUturnLeftIcon
            size={22}
            color={theme.colors.onBackground}
            onPress={restoreHandler}
          />
        )}
        <PencilSquareIcon
          size={22}
          color={theme.colors.onBackground}
          onPress={() => setIsEdit(!isEdit)}
        />
      </View>
      <View style={[tw` mb-2`]}>
        <Text style={[theme.fonts.headlineMedium]}>Recent Removed</Text>
      </View>
      <NoteList
        list={nodeList}
        isEditModel={isEdit}
        onCheckBoxChange={setSelectedIds}
        onPressItem={onPressItemHandler}
      />
    </View>
  )
}

export default RecentRemoved
