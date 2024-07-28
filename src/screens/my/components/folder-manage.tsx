import { View, Text, Dimensions, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { Drawer, TouchableRipple, useTheme } from 'react-native-paper'
import { XMarkIcon } from 'react-native-heroicons/outline'

import tw from 'twrnc'
import { Folder } from '@/service/basic'
import FolderList, { itemStyle, itemTextStyle } from './folder-list'
import FolderOtherNav from './folder-other-nav'
import useToggle from '@/hooks/useToggle'
import FolderEdit from './folder-edit'
import { ICurrentFolder } from '@/utils/utilsStorage'
import { useNote } from '@/context/note-provider'

type FolderManageProps = {
  currentFolder: ICurrentFolder
  style: object
  closeDrawer: () => void
  onCheckFolderItem: (folder: Folder) => void
}

const { width, height } = Dimensions.get('window')

export default function FolderManage({ style, closeDrawer, onCheckFolderItem, currentFolder }: FolderManageProps) {
  const theme = useTheme()

  const [showNewDrawer, toggleshowNewDrawer] = useToggle(false)
  const [outClicked, setOutClicked] = useState(0)
  const [targetEditFolder, setTargetEditFolder] = useState<Folder>()

  const { folders, refreshFolders: refreshPage, noteLength } = useNote()

  const onFolderEditClose = (needRefresh?: boolean) => {
    toggleshowNewDrawer(false)
    setTargetEditFolder(undefined)
    if (needRefresh) {
      refreshPage()
    }
  }
  const onEditFolder = (folder: Folder) => {
    setTargetEditFolder(folder)
    toggleshowNewDrawer(true)
  }

  const onCheckFolderItemHandle = (folder: Folder) => {
    onCheckFolderItem(folder)
  }

  const onDismissKeyboard = () => {
    Keyboard.dismiss()
    setOutClicked(preCount => ++preCount)
  }

  return (
    <>
      <Drawer.Section
        style={[style, tw`flex-col`, { height, backgroundColor: 'rgba(0,0,0,0.6)', width }]}
        showDivider={false}
      >
        <TouchableWithoutFeedback onPress={onDismissKeyboard} style={{ height }}>
          <View
            style={[{ minHeight: 200, maxHeight: 450, width }, tw`bg-gray-100  pb-8 absolute bottom-0 rounded-t-xl`]}
          >
            <View style={tw`flex-row justify-center px-4 py-3`}>
              <TouchableOpacity onPress={closeDrawer} style={tw`absolute top-4 left-4`}>
                <XMarkIcon size={22} color={theme.colors.onBackground} />
              </TouchableOpacity>
              <Text style={[theme.fonts.titleMedium, { color: theme.colors.onBackground }]}>Folders</Text>
              {/* <View style={tw`justify-center items-center flex-row flex-1`}>
              </View> */}
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{}}>
              <View style={[tw`flex-row justify-start px-5 gap-6 flex-wrap py-2`, { width }]}>
                <TouchableRipple onPress={() => toggleshowNewDrawer(true)}>
                  <View style={[itemStyle, tw`justify-center `, {}]}>
                    <Text style={itemTextStyle}>+</Text>
                  </View>
                </TouchableRipple>
                <TouchableRipple onPress={() => onCheckFolderItemHandle({ id: '', name: 'ALL FOLDERS' })}>
                  <View style={[itemStyle, tw`bg-blue-700 `, currentFolder?.id === '' && tw` border-yellow-500`]}>
                    <Text style={itemTextStyle}>All NOTES({noteLength})</Text>
                  </View>
                </TouchableRipple>
                {folders?.length > 0 && (
                  <FolderList
                    currentFolder={currentFolder}
                    folders={folders}
                    onEditFolder={onEditFolder}
                    onDeleteFolder={refreshPage}
                    outClickedCount={outClicked}
                    onCheckFolderItemHandle={onCheckFolderItemHandle}
                  />
                )}
              </View>

              {/* 隐藏笔记 & 最近删除 列表 */}
              <FolderOtherNav />
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>

        {/* new folder input drawer */}
        {showNewDrawer && <FolderEdit onClose={onFolderEditClose} targetEditFolder={targetEditFolder} />}
      </Drawer.Section>
    </>
  )
}
