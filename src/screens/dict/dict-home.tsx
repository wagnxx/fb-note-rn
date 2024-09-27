import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import DictListComponent from './components/DictListComponent'
import WordListComponent from './components/WordListComponent'
import { Text, View } from 'react-native'
import { Button } from 'react-native-paper'
import tw from 'twrnc'
import { useDict } from '@/features/dict/uesDict'

const DictHome: React.FC = () => {
  const hasSelectedDict = useSelector((state: RootState) => state.dict.hasSelectedDict)
  const [showMeaning, setshowMeaning] = useState(false)
  const { wordsCount } = useDict()

  return (
    <View style={{ flex: 1 }}>
      {hasSelectedDict ? (
        <View>
          <View style={[tw`flex-row justify-between items-center px-2`]}>
            <Text>COUNT({wordsCount})</Text>
            <Button onPress={() => setshowMeaning(!showMeaning)}>Show Meaning</Button>
          </View>
          <WordListComponent showMeaning={showMeaning} />
        </View>
      ) : (
        <DictListComponent />
      )}
    </View>
  )
}

export default DictHome
