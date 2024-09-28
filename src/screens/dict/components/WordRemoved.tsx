import { WordItem } from '@/features/dict/dictSlice'
import { useDict } from '@/features/dict/uesDict'
import React, { FC } from 'react'
import { FlatList } from 'react-native'
import { useTheme } from 'react-native-paper'
import tw from 'twrnc'
import LongPressWord from './LongPressWord'

const WordRemoved = () => {
  const { removedWords } = useDict()
  const theme = useTheme()

  return (
    <FlatList
      data={removedWords}
      keyExtractor={item => item.name.toString()}
      renderItem={({ item }) => <RowItem item={item} />}
      style={[tw`px-2 `, { backgroundColor: theme.colors.background }]}
    />
  )
}

const RowItem: FC<{ item: WordItem }> = ({ item }) => {
  return <LongPressWord wordItem={item} />
}

export default WordRemoved
