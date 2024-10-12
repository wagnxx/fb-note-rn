import React, { useEffect, useState } from 'react'
import { RootStackParamList, ScreenProps, ScrennTypeEnum } from '@/types/screen'
import { RouteProp, useRoute } from '@react-navigation/native'
import { Note, getNote } from '@/service/articles'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { RadioButton, useTheme } from 'react-native-paper'
import { extractTextFromHTML } from '@/utils/utilsString'
import Markdown from 'react-native-markdown-display'
import { DocType } from './create'
import tw from 'twrnc'
export default function NodeDetail({ navigation }: ScreenProps<ScrennTypeEnum.NodeDetail>) {
  const { params } = useRoute<RouteProp<RootStackParamList>>()
  const [note, setNote] = useState<Note | null>(null)
  const [showType, setShowType] = useState<DocType>(null)
  const theme = useTheme()

  const fetchNote = (id: string) => {
    getNote(id).then(data => {
      if (data) {
        data.titleText = extractTextFromHTML(data.title)
        setNote(data)
        const dtype = data.docType || 'html'
        setShowType(dtype)
      } else {
        setNote(null)
      }
    })
  }

  useEffect(() => {
    if (params?.id) {
      fetchNote(params.id)
    }
  }, [params])

  const htmlContent = `
  <style>
    body {
      font-size: 35px;
      padding: 10px;
    }
  </style>
  <body>
  ${note?.content} 
  </body>
`

  return (
    <SafeAreaView style={styles.container}>
      <RadioButton.Group onValueChange={value => setShowType(value)} value={showType}>
        <View style={[tw`flex-row items-center px-2`]}>
          <Text>Display DocType:</Text>
          <View style={[tw`flex-row items-center`]}>
            <RadioButton value="html" />
            <Text>PLain</Text>
          </View>
          <View style={[tw`flex-row items-center`]}>
            <RadioButton value="md" />
            <Text>Markdown</Text>
          </View>
        </View>
      </RadioButton.Group>

      {showType === 'html' && (
        <>
          <View style={{ justifyContent: 'center', flexDirection: 'row', padding: 8 }}>
            <Text style={[theme.fonts.titleLarge, { color: theme.colors.onSurface }]}>
              {note?.titleText}
            </Text>
          </View>

          <WebView originWhitelist={['*']} source={{ html: htmlContent }} style={{ flex: 1 }} />
        </>
      )}
      {showType === 'md' && (
        <View style={[tw`px-2`]}>
          <Markdown>{note?.title}</Markdown>
          <Markdown>{note?.content}</Markdown>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 44,
  },
})
