import { WordItem } from '@/features/dict/dictSlice'
import { useDict } from '@/features/dict/uesDict'
import React, { FC } from 'react'
import { FlatList, Text, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import tw from 'twrnc'
import LongPressWord from './LongPressWord'
import { CustomMD3Theme } from 'theme'

const WordArchived = () => {
  const { wordsCollection, hasWordsCollectionChanged } = useDict()
  const theme = useTheme<CustomMD3Theme>()

  return (
    <View style={[tw`flex-1 px-2 `, { backgroundColor: theme.colors.background }]}>
      <Text style={[theme.fonts.titleMedium, { color: theme.colors.red }]}>
        hasWordsCollectionChanged: {hasWordsCollectionChanged.toString()}
      </Text>
      <FlatList
        data={wordsCollection}
        keyExtractor={item => item.name.toString()}
        renderItem={({ item }) => <RowItem item={item} />}
      />
    </View>
  )
}

const RowItem: FC<{ item: WordItem }> = ({ item }) => {
  return <LongPressWord wordItem={item} />
}

export default WordArchived
