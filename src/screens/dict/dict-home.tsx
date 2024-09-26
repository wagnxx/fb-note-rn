import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import DictListComponent from './components/DictListComponent'
import WordListComponent from './components/WordListComponent'
import { View } from 'react-native'

const DictHome: React.FC = () => {
  const hasSelectedDict = useSelector((state: RootState) => state.dict.hasSelectedDict)

  return (
    <View style={{ flex: 1 }}>
      {hasSelectedDict ? <WordListComponent /> : <DictListComponent />}
    </View>
  )
}

export default DictHome
