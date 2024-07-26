import { View, Text, TouchableOpacity } from 'react-native'
import React, { FC } from 'react'
import { transFBDate2Local } from '@/utils/utilsDate'
import { useTheme } from 'react-native-paper'
import tw from 'twrnc'
import { Note } from '@/service/articles'
import { Timestamp } from '@react-native-firebase/firestore'
type NoteListProps = {
  list: Partial<Note>[]
  onPressItem?: (item: Partial<Note>) => void
}

// eslint-disable-next-line unused-imports/no-unused-vars-ts
const voidFunc = (item: Partial<Note>) => {}

const NoteList: FC<NoteListProps> = ({ list, onPressItem = voidFunc }) => {
  const theme = useTheme()
  return list.map((item, index) => (
    <View
      style={[
        tw`flex-row items-center justify-between mt-2 border-b border-slate-200 bg-white  py-3 px-2`,
        { borderRadius: 18 },
      ]}
      key={index}
    >
      {/* <UserCircleIcon size={30} color={'#aaa'} /> */}

      <TouchableOpacity onPress={() => onPressItem(item)}>
        <View>
          <Text
            style={[
              {
                color: theme.colors.onBackground,
              },
              theme.fonts.titleMedium,
            ]}
          >
            {item.title}
          </Text>
          <Text style={[{ color: theme.colors.secondary }, theme.fonts.labelSmall]}>
            {transFBDate2Local(item.createTime as Timestamp)}
          </Text>
        </View>
        {/* <EyeIcon size={30} color={theme.colors.secondary} /> */}
      </TouchableOpacity>
    </View>
  ))
}
export default NoteList
