import { WordItem } from '@/features/dict/dictSlice'
import React, { FC, useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { ChevronDownIcon, ChevronUpIcon } from 'react-native-heroicons/outline'
import { useTheme } from 'react-native-paper'
import tw from 'twrnc'
import SpeechButton from './SpeechButton'

const RowItem: FC<{ item: WordItem; showMeaning: boolean }> = ({ item, showMeaning }) => {
  const [showItemMeaning, setShowItemMeaning] = useState(showMeaning)
  const theme = useTheme()

  useEffect(() => {
    setShowItemMeaning(showMeaning)
  }, [showMeaning])

  return (
    <View style={[tw`gap-1 py-1`]}>
      <View style={[tw`flex-row items-center gap-2 justify-between`]}>
        <Text style={[theme.fonts.titleMedium]}>{item.name}</Text>
        {showItemMeaning ? (
          <ChevronUpIcon
            size={16}
            color={theme.colors.onPrimaryContainer}
            onPress={() => setShowItemMeaning(!showItemMeaning)}
          />
        ) : (
          <ChevronDownIcon
            size={16}
            color={theme.colors.onPrimaryContainer}
            onPress={() => setShowItemMeaning(!showItemMeaning)}
          />
        )}
      </View>
      {showItemMeaning && (
        <View>
          <View style={[tw`flex-row gap-4`]}>
            <Text style={[theme.fonts.labelSmall]}>UK /{item.ukphone}/</Text>
            <SpeechButton word={item.name} isAmerican={false} />
          </View>
          <View style={[tw`flex-row gap-4`]}>
            <Text style={[theme.fonts.labelSmall]}>US /{item.usphone}/</Text>
            <SpeechButton word={item.name} isAmerican={true} />
          </View>
          <Text style={[tw``, theme.fonts.labelMedium]}>{item.trans.toLocaleString()}</Text>
        </View>
      )}
    </View>
  )
}

export default RowItem
