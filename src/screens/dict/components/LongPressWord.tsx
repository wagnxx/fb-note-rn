import { toggleWordCollections, WordItem } from '@/features/dict/dictSlice'
import React, { useCallback, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableRipple, Dialog, Portal, Button, useTheme } from 'react-native-paper'
import SpeechButton from './SpeechButton'
import tw from 'twrnc'
import { StarIcon } from 'react-native-heroicons/outline'
import { StarIcon as StarIconFill } from 'react-native-heroicons/solid'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import { useDict } from '@/features/dict/uesDict'

const LongPressWord = ({ wordItem }: { wordItem: WordItem }) => {
  const [visible, setVisible] = useState(false)
  const { wordCollections } = useDict()
  const showDialog = () => setVisible(true)
  const hideDialog = () => setVisible(false)

  const theme = useTheme()

  const dispatch = useDispatch<AppDispatch>()

  const isArchived = useCallback(
    (word: WordItem) => {
      return wordCollections.some(item => item.name === word.name)
    },
    [wordCollections],
  )

  return (
    <View style={styles.container}>
      <TouchableRipple
        onLongPress={showDialog}
        style={styles.wordButton}
        rippleColor="rgba(255, 255, 255, .32)"
      >
        <Text style={[theme.fonts.titleMedium, { color: theme.colors.onBackground }]}>
          {wordItem.name}
        </Text>
      </TouchableRipple>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>
            <Text>{wordItem.name}</Text>
            {isArchived(wordItem) ? (
              <StarIconFill
                size={16}
                color={'#ffeb3b'}
                onPress={() => dispatch(toggleWordCollections(wordItem))}
              />
            ) : (
              <StarIcon
                size={16}
                color={theme.colors.onBackground}
                onPress={() => dispatch(toggleWordCollections(wordItem))}
              />
            )}
          </Dialog.Title>
          <Dialog.Content>
            <View style={[tw`gap-1`]}>
              <View />
              <View style={[tw`flex-row gap-2 items-center`]}>
                <Text style={[theme.fonts.labelSmall]}>UK /{wordItem.ukphone}/</Text>
                <SpeechButton word={wordItem.name} isAmerican={false} />
              </View>
              <View style={[tw`flex-row gap-2 items-center`]}>
                <Text style={[theme.fonts.labelSmall]}>US /{wordItem.usphone}/</Text>
                <SpeechButton word={wordItem.name} isAmerican={true} />
              </View>

              <Text style={[tw``, theme.fonts.labelMedium]}>{wordItem.trans.toLocaleString()}</Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // padding: 20,
  },
  wordButton: {
    // padding: 10,
    // backgroundColor: '#e0e0e0',
    // borderRadius: 5,
  },
  wordText: {
    fontSize: 18,
  },
  notation: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  translation: {
    marginLeft: 10,
  },
})

export default LongPressWord
