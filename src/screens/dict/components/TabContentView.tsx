import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import { DictInfo, dictionaryResources } from '@/features/dict/dict_info'
import { insertJsonToDictCollection } from '@/features/dict/dictSlice'
import { AppDispatch } from '@/store'

interface Props {
  category: string
}

const TabContentView: React.FC<Props> = ({ category }) => {
  const [tagDict, setTagDict] = useState<DictInfo[]>([])
  const dispatch = useDispatch<AppDispatch>()

  const list: DictInfo[] = dictionaryResources.filter(item => item.category === category)
  const tags = Array.from(new Set(list.flatMap(item => item.tags)))

  const handleTagPress = (tag: string) => {
    const filteredItems = list.filter(item => item.tags.includes(tag))
    setTagDict(filteredItems)
  }

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      {tags.map((tag, index) => (
        <TouchableOpacity key={index} onPress={() => handleTagPress(tag)}>
          <Text>{tag}</Text>
        </TouchableOpacity>
      ))}
      <Text style={{ fontSize: 18 }}>Tag json list</Text>
      {tagDict.map(item => (
        <TouchableOpacity key={item.id} onPress={() => dispatch(insertJsonToDictCollection(item))}>
          <Text>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

export default TabContentView
