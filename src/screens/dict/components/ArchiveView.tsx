import React from 'react'
import { FlatList, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

const ArchiveView: React.FC = () => {
  const wordList = useSelector((state: RootState) => Object.values(state.dict.words)[0])
  // const [wordList, setWordList] = useState(wordArchiveList)

  // useEffect(() => {
  //   setWordList(wordArchiveList)
  // }, [wordArchiveList])

  return (
    <FlatList
      data={wordList}
      keyExtractor={item => item.name.toString()}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  )
}

export default ArchiveView
