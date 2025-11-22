import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, Drawer, Text, TextInput, useTheme } from 'react-native-paper'
import tw from 'twrnc'
import { useNote } from '@/context/note-provider'
import { Note } from '@/service/articles'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList, ScrennTypeEnum } from '@/types/screen'
import { extractTextFromHTML } from '@/utils/utilsString'
import { transFBDate2Local } from '@/utils/utilsDate'
const { width, height } = Dimensions.get('window')

type NoteSearchProps = {
  style: object
  closeDrawer: () => void
}
const highlightText = (text, query) => {
  if (!query) return <Text>{text}</Text>

  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)

  return (
    <Text>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <Text key={index} style={styles.highlight}>
            {part}
          </Text>
        ) : (
          <Text key={index}>{part}</Text>
        ),
      )}
    </Text>
  )
}

const getSurroundingWords = (text, query, surroundingWordsCount = 3) => {
  if (!query) return text

  const regex = new RegExp(
    `.{0,${surroundingWordsCount}}${query}.{0,${surroundingWordsCount}}`,
    'gi',
  )

  const matches = text.match(regex)

  console.log('matches', matches)

  if (!matches) return text

  return matches.join('...')
}

export default function NoteSearch({ style, closeDrawer }) {
  const theme = useTheme()
  const navigation = useNavigation<RootStackParamList>()
  const [results, setResults] = useState<Note[]>([])
  const [keywords, setKeywords] = useState('')
  const { findNotesBykeyword } = useNote()

  useEffect(() => {
    if (keywords.length < 2) {
      setResults([])
      return
    }
    let r = findNotesBykeyword(keywords)
    r = r
      .map(item => {
        item.contentText = extractTextFromHTML(item.content)
        return item
      })
      .map(item => {
        item.contentText = getSurroundingWords(item.contentText, keywords, 4)
        return item
      })
    // contentText
    setResults(r)
  }, [findNotesBykeyword, keywords])

  const onChangeText = text => {
    setKeywords(text)
  }
  const enterDetail = item => {
    if (!item?.id) return
    navigation.navigate(ScrennTypeEnum.NodeDetail, { id: item.id })
  }

  return (
    <Drawer.Section
      style={[
        style,
        tw`flex-col`,
        { height, backgroundColor: 'rgba(0,0,0,0.6)', width },
      ]}
      showDivider={false}
    >
      <View style={[tw`bg-gray-100 flex-row items-center `]}>
        <TextInput
          style={[tw`flex-1 bg-gray-100`]}
          value={keywords}
          onChangeText={onChangeText}
        />
        <Button
          onPress={closeDrawer}
          style={[
            tw`px-2`,
            {
              borderBlockColor: theme.colors.primaryContainer,
              borderWidth: 1,
            },
          ]}
        >
          <Text style={[tw` pl-2`, { color: theme.colors.onPrimaryContainer }]}>
            cancel
          </Text>
        </Button>
      </View>
      <View style={[tw`flex-1 p-2 `, results?.length > 0 && tw`bg-gray-100`]}>
        <ScrollView>
          {results?.length > 0
            ? results.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => enterDetail(item)}
                style={tw`py-2`}
              >
                {highlightText(item.titleText, keywords)}
                  {highlightText(item.contentText, keywords)}
                  <Text style={[theme.fonts.labelSmall]}>
                  {transFBDate2Local(item.createTime)}
                </Text>
              </Pressable>
              ))
            : null}
        </ScrollView>
      </View>
    </Drawer.Section>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  highlight: {
    backgroundColor: 'yellow',
  },
})
