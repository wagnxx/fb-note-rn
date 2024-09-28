import React, { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { DictInfo, dictionaryResources } from '@/features/dict/dict_info'
import { insertJsonToDictCollection } from '@/features/dict/dictSlice'
import { AppDispatch } from '@/store'
import tw from 'twrnc'
import { Divider, useTheme } from 'react-native-paper'
import { ChevronRightIcon } from 'react-native-heroicons/outline'

interface Props {
  category: string
}

const TabContentView: React.FC<Props> = ({ category }) => {
  const [tagDict, setTagDict] = useState<DictInfo[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const theme = useTheme()

  const [selectedTag, setSelectedTag] = useState('')

  const list: DictInfo[] = dictionaryResources.filter(item => item.category === category)
  const tags = Array.from(new Set(list.flatMap(item => item.tags)))

  const handleTagPress = (tag: string) => {
    const filteredItems = list.filter(item => item.tags.includes(tag))
    setTagDict(filteredItems)
    setSelectedTag(tag)
  }

  return (
    <ScrollView
      style={{}}
      contentContainerStyle={{
        padding: 10,
        flexDirection: 'row',
        backgroundColor: theme.colors.background,
      }}
    >
      <View style={[tw`flex-1 gap-1`]}>
        {tags.map((tag, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleTagPress(tag)}
            style={[tw`flex-row justify-between`]}
          >
            <Text style={[theme.fonts.labelMedium, { color: theme.colors.onPrimary }]}>{tag}</Text>

            {selectedTag === tag ? (
              <ChevronRightIcon size={16} color={theme.colors.onPrimary} />
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
      <View style={[tw`bg-gray-300 w-1`]} />
      <View style={[tw`flex-1 pl-2 gap-2`]}>
        <Text style={[theme.fonts.titleMedium]}>Tag json file list</Text>
        <Divider />
        {tagDict.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => dispatch(insertJsonToDictCollection(item))}
          >
            <Text style={[theme.fonts.labelMedium]}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )
}

export default TabContentView
