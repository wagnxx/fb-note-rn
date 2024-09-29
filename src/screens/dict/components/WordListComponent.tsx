import React, { useCallback, useMemo, useState } from 'react'
import tw from 'twrnc'
import { Searchbar, useTheme } from 'react-native-paper'
import RowItem from './RowItem'
import { FlatList, View } from 'react-native'
import { ListBulletIcon, Squares2X2Icon } from 'react-native-heroicons/outline'
import { useDict } from '@/features/dict/uesDict'

const WordListComponent: React.FC<{ showMeaning: boolean }> = ({ showMeaning }) => {
  const { currentWordList } = useDict()
  const theme = useTheme()

  const [searchQuery, setSearchQuery] = React.useState('')
  const [layoutType, setLayoutType] = useState<'list' | 'grid'>('list')

  const toggleLayoutType = useCallback(() => {
    if (layoutType === 'list') {
      setLayoutType('grid')
    } else {
      setLayoutType('list')
    }
  }, [layoutType])

  const wordList = useMemo(() => {
    return currentWordList?.filter(Boolean).filter(item => item.name.includes(searchQuery)) || []
  }, [currentWordList, searchQuery])

  return (
    <View style={[tw``]}>
      <View style={[tw`flex-row gap-2 justify-between items-center px-2 my-2`]}>
        <View style={[tw`flex-1`]}>
          <Searchbar placeholder="Search" onChangeText={setSearchQuery} value={searchQuery} />
        </View>
        {layoutType === 'list' && (
          <ListBulletIcon size={20} color={theme.colors.onBackground} onPress={toggleLayoutType} />
        )}
        {layoutType === 'grid' && (
          <Squares2X2Icon size={20} color={theme.colors.onBackground} onPress={toggleLayoutType} />
        )}
      </View>
      <FlatList
        data={wordList}
        keyExtractor={item => item.name.toString()}
        renderItem={({ item }) => (
          <RowItem item={item} showMeaning={showMeaning} isLayoutGrid={layoutType === 'grid'} />
        )}
        style={[tw`px-2 `, { backgroundColor: theme.colors.background }]}
        numColumns={layoutType === 'list' ? 1 : 4}
        key={layoutType === 'list' ? 1 : 4}
      />
    </View>
  )
}

export default WordListComponent
