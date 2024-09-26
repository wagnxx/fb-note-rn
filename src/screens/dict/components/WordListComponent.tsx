import React from 'react'
import { FlatList } from 'react-native'
import { useSelector } from 'react-redux'
import { type RootState } from '@/store/index'
import RowItem from './RowItem'

const WordListComponent: React.FC = () => {
  const colIds = useSelector((state: RootState) => state.dict.dictCollection)
  const wordList = useSelector((state: RootState) => state.dict.words[colIds[0]])

  return (
    <FlatList
      data={wordList}
      keyExtractor={item => item.name.toString()}
      renderItem={({ item }) => <RowItem item={item} />}
    />
  )
}

export default WordListComponent
