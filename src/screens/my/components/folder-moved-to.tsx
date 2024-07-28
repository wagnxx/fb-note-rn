import { View, Text, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Drawer, TouchableRipple, useTheme } from 'react-native-paper'
import tw from 'twrnc'
import { CheckIcon, XMarkIcon } from 'react-native-heroicons/outline'
import FolderList, { itemStyle, itemTextStyle } from './folder-list'
import { useNote } from '@/context/note-provider'
import { ICurrentFolder } from '@/utils/utilsStorage'
import { Folder } from '@/service/basic'

const { width, height } = Dimensions.get('window')

type FolderMovedToType = {
  style?: object
  closeDrawer?: () => void
  onMoveNoteToFolder?: (id: string) => void
}

export default function FolderMovedTo({ style, closeDrawer, onMoveNoteToFolder = () => {} }: FolderMovedToType) {
  const theme = useTheme()
  const { folders } = useNote()
  const [currentFolder, setCurrentFolder] = useState<ICurrentFolder>(null)

  const onCheckFolderItemHandle = (folder: Folder) => {
    setCurrentFolder(folder)
  }

  const moveNoteToFolder = () => {
    if (currentFolder?.id) {
      onMoveNoteToFolder(currentFolder.id)
    }
  }

  return (
    <Drawer.Section
      style={[style, tw`flex-col`, { height, backgroundColor: 'rgba(0,0,0,0.6)', width }]}
      showDivider={false}
    >
      <View style={[{ minHeight: 200, maxHeight: 450, width }, tw`bg-gray-100  pb-8 absolute bottom-10 rounded-t-xl`]}>
        <View style={tw`flex-row justify-between items-center px-4 py-3`}>
          <TouchableOpacity onPress={closeDrawer} style={tw``}>
            <XMarkIcon size={22} color={theme.colors.onBackground} />
          </TouchableOpacity>
          <Text style={[theme.fonts.titleMedium, { color: theme.colors.onBackground }]}>Folders</Text>
          <TouchableOpacity onPress={moveNoteToFolder} style={tw``}>
            <CheckIcon size={22} color={currentFolder ? theme.colors.onBackground : theme.colors.surfaceDisabled} />
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{}}>
          <View style={[tw`flex-row justify-start px-5 gap-6 flex-wrap py-2`, { width }]}>
            <TouchableRipple onPress={() => onCheckFolderItemHandle({ id: '', name: 'ALL FOLDERS' })}>
              <View style={[itemStyle, tw`bg-blue-700 `, currentFolder?.id === '' && tw` border-yellow-500`]}>
                <Text style={itemTextStyle}>All NOTES</Text>
              </View>
            </TouchableRipple>
            {folders?.length > 0 && (
              <FolderList
                currentFolder={currentFolder}
                folders={folders}
                onCheckFolderItemHandle={onCheckFolderItemHandle}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </Drawer.Section>
  )
}
