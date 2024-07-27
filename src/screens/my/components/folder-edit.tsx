import { View, Text, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { CheckIcon, XMarkIcon } from 'react-native-heroicons/outline'
import { MD3Theme, TextInput, TouchableRipple, useTheme } from 'react-native-paper'
import tw from 'twrnc'
import { createFolder, Folder, updateFolder } from '@/service/basic'
import { itemStyle, itemTextStyle } from './folder-list'

type FolderEditTProps = {
  onClose: (refresh?: boolean) => void
  targetEditFolder?: Folder
}

type SelectinType = Pick<Folder, 'container' | 'textColor'>
const initSelections: (theme: MD3Theme) => SelectinType[] = theme => {
  const selections = [
    {
      container: 'rgb(229 231 235)',
      textColor: 'rgb(156 163 175)',
    },
    {
      container: theme.colors.primary,
      textColor: theme.colors.onPrimary,
    },
    {
      container: theme.colors.primaryContainer,
      textColor: theme.colors.onPrimaryContainer,
    },
    {
      container: theme.colors.secondary,
      textColor: theme.colors.onSecondary,
    },
    {
      container: theme.colors.secondaryContainer,
      textColor: theme.colors.onSecondaryContainer,
    },
    {
      container: theme.colors.tertiary,
      textColor: theme.colors.onTertiary,
    },
    {
      container: theme.colors.tertiaryContainer,
      textColor: theme.colors.onTertiaryContainer,
    },
  ]
  return selections
}

const { width, height } = Dimensions.get('window')

export default function FolderEdit({ onClose, targetEditFolder }: FolderEditTProps) {
  const theme = useTheme()

  const [newFolderValue, setNewFolderValue] = useState<string>('')
  const [newFolderId, setNewFolderId] = useState<string>('')
  const [selections, setSelections] = useState(initSelections(theme))
  const [selectedBgItem, setselectedBgItem] = useState(selections[0])

  const closeNewFolderDrawer = () => {
    setNewFolderValue('')
    setNewFolderId('')
    setselectedBgItem(selections[0])
    onClose()
  }

  const createNewFolder = () => {
    if (newFolderValue.length < 3) {
      Alert.alert('warning', 'new folder name should grade than 3 charts')
      return
    }

    let fn
    let options = {}

    if (!newFolderId) {
      fn = createFolder
    } else {
      fn = updateFolder
      options = {
        ...options,
        id: newFolderId,
      }
    }

    fn({ name: newFolderValue, ...selectedBgItem, ...options })
      .then(res => {
        if (res) {
          Alert.alert('warning', 'create success.')
          onClose(true)
        } else {
          Alert.alert('warning', 'create failed.')
        }
      })
      .then(err => {
        console.log('create err:::', err)
      })
  }

  const initEditParams = useCallback(
    (folder: Folder) => {
      if (!folder?.id) return
      console.log('edit folder::::', folder)
      setNewFolderId(folder.id)
      setNewFolderValue(folder.name)

      let selectedBgIndex = selections.findIndex(item => item.container === folder.container)
      selectedBgIndex = selectedBgIndex == -1 ? 0 : selectedBgIndex
      setselectedBgItem(selections[selectedBgIndex])
    },
    [selections],
  )

  useEffect(() => {
    if (targetEditFolder) {
      initEditParams(targetEditFolder)
    }
  }, [targetEditFolder, initEditParams])

  return (
    <View style={[{ height: 500, width }, tw`bg-gray-100 px-2 pb-8 absolute bottom-0 rounded-t-xl`]}>
      <View style={[tw`p-2`]}>
        <View style={tw`flex-row justify-between items-center gap-8  py-3`}>
          <TouchableOpacity onPress={closeNewFolderDrawer}>
            <XMarkIcon size={22} color={theme.colors.onBackground} />
          </TouchableOpacity>
          <Text style={[theme.fonts.titleMedium, { color: theme.colors.onBackground }]}>Create New Note</Text>
          <TouchableOpacity onPress={createNewFolder}>
            <CheckIcon size={22} color={theme.colors.onBackground} />
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder="please enter."
          value={newFolderValue}
          onChangeText={text => setNewFolderValue(text)}
          style={[{ backgroundColor: '#fff' }, tw`rounded-sm`]}
        />

        <View style={tw`bg-white mt-4 p-3 rounded-lg`}>
          <View style={tw`justify-center items-center`}>
            <TouchableRipple onPress={() => {}}>
              <View style={[itemStyle, { backgroundColor: selectedBgItem.container }]}>
                <Text style={[itemTextStyle, { color: selectedBgItem.textColor }]}>NOTES</Text>
              </View>
            </TouchableRipple>
          </View>

          <View style={tw`mt-4`}>
            <Text style={[theme.fonts.labelMedium, { color: theme.colors.onBackground }]}>Pure Colors</Text>
            <ScrollView horizontal>
              <View style={tw`flex-row gap-4`}>
                {selections.map((item, index) => (
                  <TouchableRipple
                    onPress={() => {
                      setselectedBgItem(item)
                    }}
                    key={index}
                  >
                    <View
                      style={[
                        itemStyle,
                        tw`${selectedBgItem === item ? 'border-yellow-500' : ''} `,
                        { backgroundColor: item.container, width: width * 0.22, height: width * 0.3 },
                      ]}
                    >
                      <Text style={[itemTextStyle, { color: item.textColor }]}>NOTES</Text>
                    </View>
                  </TouchableRipple>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  )
}
