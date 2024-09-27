import { toggleWordCollections, WordItem } from '@/features/dict/dictSlice'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { ChevronDownIcon, ChevronUpIcon, StarIcon, TrashIcon } from 'react-native-heroicons/outline'
import { StarIcon as StarIconFill } from 'react-native-heroicons/solid'
import { useTheme } from 'react-native-paper'
import tw from 'twrnc'
import SpeechButton from './SpeechButton'
import LongPressWord from './LongPressWord'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import { useDict } from '@/features/dict/uesDict'

const RowItem: FC<{ item: WordItem; showMeaning: boolean; isLayoutGrid: boolean }> = ({
  item,
  showMeaning,
  isLayoutGrid = false,
}) => {
  const { wordCollections } = useDict()
  const [showItemMeaning, setShowItemMeaning] = useState(showMeaning)
  const theme = useTheme()

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    setShowItemMeaning(showMeaning)
  }, [showMeaning])

  const isArchived = useCallback(
    (word: WordItem) => {
      return wordCollections.some(item => item.name === word.name)
    },
    [wordCollections],
  )
  return (
    <View style={[tw`gap-2 py-1 px-1`]}>
      <View style={[tw`flex-row items-center gap-2 justify-between`]}>
        {/* <Text style={[theme.fonts.titleMedium]}>{item.name}</Text> */}
        <LongPressWord wordItem={item} />
        {isLayoutGrid ? null : (
          <>
            <View style={[tw`flex-row flex-1 gap-2 justify-end`]}>
              <TrashIcon size={16} color={theme.colors.onBackground} />
              {isArchived(item) ? (
                <StarIconFill
                  size={16}
                  color={'#ffeb3b'}
                  onPress={() => dispatch(toggleWordCollections(item))}
                />
              ) : (
                <StarIcon
                  size={16}
                  color={theme.colors.onBackground}
                  onPress={() => dispatch(toggleWordCollections(item))}
                />
              )}
            </View>
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
          </>
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
