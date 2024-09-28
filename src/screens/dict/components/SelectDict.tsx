import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useDict } from '@/features/dict/uesDict'
import { loadDictCollection, setSelectedDictId } from '@/features/dict/dictSlice'
import { useDispatch } from 'react-redux'

const SelectDict = () => {
  const { dictCollection } = useDict()

  const dispatch = useDispatch()

  useEffect(() => {
    loadDictCollection(dispatch)
  }, [dispatch])

  return (
    <View style={{ flex: 1 }}>
      <Text>colids:</Text>
      <Text>{JSON.stringify(dictCollection)}</Text>
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
