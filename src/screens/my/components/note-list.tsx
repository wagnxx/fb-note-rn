import { View, Text, TouchableOpacity } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { transFBDate2Local } from '@/utils/utilsDate'
import { useTheme } from 'react-native-paper'
import tw from 'twrnc'
import { Note } from '@/service/articles'
import { Timestamp } from '@react-native-firebase/firestore'
import { CheckCircleIcon } from 'react-native-heroicons/outline'
import { CheckBox } from 'react-native-elements'
type NoteListProps = {
  list: Partial<Note>[]
  showCheckBox: boolean
  onCheckBoxChange: (selectedIds: string[]) => void
  onPressItem?: (item: Partial<Note>) => void
}

// eslint-disable-next-line unused-imports/no-unused-vars-ts
const voidFunc = (item: Partial<Note>) => {}

const NoteList: FC<NoteListProps> = ({ list, onPressItem = voidFunc, showCheckBox, onCheckBoxChange }) => {
  const theme = useTheme()
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({})

  const checkItemHandle = item => {
    setCheckedMap(prevMap => {
      const newValue = {
        ...prevMap,
        [item.id]: !prevMap[item.id],
      }

      return newValue
    })

    // console.log('checkedMap', ids)
  }

  useEffect(() => {
    const entries = Object.entries(checkedMap).filter(([k, v]) => v)
    const ids = entries.map(([k]) => k)
    onCheckBoxChange(ids)
  }, [checkedMap, onCheckBoxChange])

  useEffect(() => {
    if (!showCheckBox) {
      setCheckedMap({})
    }
  }, [showCheckBox])

  return list.map((item, index) => (
    <View
      style={[
        tw`flex-row items-center justify-between mt-2 border-b border-slate-200 bg-white  py-3 px-2`,
        { borderRadius: 18 },
      ]}
      key={index}
    >
      {/* <UserCircleIcon size={30} color={'#aaa'} /> */}

      <TouchableOpacity onPress={() => !showCheckBox && onPressItem(item)}>
        <View>
          <Text
            style={[
              {
                color: theme.colors.onBackground,
              },
              theme.fonts.titleMedium,
            ]}
          >
            {item.titleText}
          </Text>
          <Text style={[{ color: theme.colors.secondary }, theme.fonts.labelSmall]}>
            {transFBDate2Local(item.createTime as Timestamp)}
          </Text>
        </View>
      </TouchableOpacity>

      {showCheckBox && (
        <CheckBox
          checked={!!checkedMap[item.id]}
          checkedIcon={<CheckCircleIcon size={22} color={theme.colors.onBackground} />}
          uncheckedIcon={<CheckCircleIcon size={22} color={theme.colors.outline} />}
          onPress={() => checkItemHandle(item)}
        />
      )}
    </View>
  ))
}
export default NoteList
