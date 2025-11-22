import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TouchableRipple, useTheme } from 'react-native-paper'
import tw from 'twrnc'
import { delFolder, Folder } from '@/service/basic'
import { ICurrentFolder } from '@/utils/utilsStorage'
import { messageConfirm } from '@/utils/utilsAlert'
const { width, height } = Dimensions.get('window')
const itemWidth = (width - 24 * 2 - 20 * 2) / 3

export const itemStyle = [
  {
    width: itemWidth,
    height: itemWidth * 1.53,
    // padding: 16,
    paddingBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  tw`bg-gray-200 items-center justify-end`,
]
export const itemTextStyle = [tw`text-gray-400`]

type FolderListProps = {
  folders: Folder[]
  currentFolder: ICurrentFolder
  onEditFolder?: (folder: Folder) => void
  onDeleteFolder?: (folder: Folder) => void
  onCheckFolderItemHandle: (folder: Folder) => void
  outClickedCount?: number
  forCheck?: boolean
}

const voidFunc = (folder: Folder) => {}

export default function FolderList({
  folders,
  currentFolder,
  outClickedCount = 0,
  forCheck = false,
  onEditFolder = voidFunc,
  onDeleteFolder = voidFunc,
  onCheckFolderItemHandle,
}: FolderListProps) {
  const theme = useTheme()
  const [visiblePopoverId, setVisiblePopoverId] = useState<string | null>(null)
  const itemRefs = useRef<{ [key: string]: any }>({})

  // const editFolder = folder => {}
  const deleteItem = (folder: Folder) => {
    if (!folder) return

    messageConfirm({
      message: `Are you sure to delete follder ${folder.name} ?`,
    }).then(() => {
      delFolder(folder.id)
        .then(res => {
          if (res) {
            onDeleteFolder(folder)
            return
          }
          console.log('del folder failed')
        })
        .catch(err => {
          console.log('del folder err::::', err)
        })
    })
  }

  const editItem = (folder: Folder) => {
    setVisiblePopoverId(null)
    onEditFolder(folder)
  }

  const showItemTooltips = (id: string) => {
    if (forCheck) {
      // only for check item
      return
    }
    setVisiblePopoverId(id)
  }
  const closeItemTooltips = useCallback(() => {
    setVisiblePopoverId(null)
  }, [])

  useEffect(() => {
    closeItemTooltips()
  }, [outClickedCount, closeItemTooltips])

  return folders.map((folder, index) => (
    <TouchableRipple
      key={index}
      onPress={() => onCheckFolderItemHandle(folder)}
      onLongPress={() =>
        folder.id !== currentFolder?.id && showItemTooltips(folder.id)
      }
      ref={ref => (itemRefs.current[folder.id] = ref)}
    >
      <View
        style={[
          itemStyle,
          { backgroundColor: folder?.container || '', position: 'relative' },
          folder.id === currentFolder?.id ? tw` border-yellow-500` : null,
        ]}
      >
        <Text style={[itemTextStyle, { color: folder?.textColor || '' }]}>
          {folder.name} ({folder?.noteCount})
        </Text>
        {visiblePopoverId === folder.id && (
          <View
            style={[
              tw`px-4 py-2 bg-white shadow-md rounded-md absolute`,

              { width: '130%' },
              index % 3 === 0 && { right: -8 },
              index % 3 === 1 && { left: -8 },
              // index % 3 === 2 && { left: -8 },
            ]}
          >
            <View style={[tw`py-1`]}>
              <TouchableOpacity onPress={() => editItem(folder)}>
                <Text style={[{ color: theme.colors.onBackground }]}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={[tw`py-1`]}>
              <TouchableOpacity onPress={() => deleteItem(folder)}>
                <Text style={[{ color: theme.colors.onBackground }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </TouchableRipple>
  ))
}
