import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDict } from '@/features/dict/uesDict'
import { loadDictCollection, setSelectedDictId } from '@/features/dict/dictSlice'
import { useDispatch } from 'react-redux'
import { Button, Divider } from 'react-native-paper'
import tw from 'twrnc'

const SelectDict = () => {
  const { dictCollection } = useDict()

  const dispatch = useDispatch()

  useEffect(() => {
    loadDictCollection(dispatch)
  }, [dispatch])

  const [showData, setShowData] = useState(false)

  return (
    <View style={[tw` px-2 pb-10`]}>
      <View style={[tw`flex-row items-center`]}>
        <Text>colids:</Text>
        <Button onPress={() => setShowData(!showData)}>Show Data</Button>
      </View>
      {showData && <Text>{JSON.stringify(dictCollection, null, 2)}</Text>}
      <Divider style={[tw`my-2`]} />
      {dictCollection.map(dict => (
        <View key={dict.id}>
          <TouchableOpacity onPress={() => dispatch(setSelectedDictId(dict.id))}>
            <Text>{dict.name}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )
}

export default SelectDict
