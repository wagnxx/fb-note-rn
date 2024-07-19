import React, { useEffect, useState } from 'react'
import { RootStackParamList, ScreenProps, ScrennTypeEnum } from '@/types/screen'
import { RouteProp, useRoute } from '@react-navigation/native'
import { Note, getNote } from '@/service/articles'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { useTheme } from 'react-native-paper'

export default function NodeDetail({ navigation }: ScreenProps<ScrennTypeEnum.NodeDetail>) {
  const { params } = useRoute<RouteProp<RootStackParamList>>()
  const [note, setNote] = useState<Note | null>(null)
  const theme = useTheme()

  const fetchNote = (id: string) => {
    getNote(id).then(data => {
      if (data) {
        setNote(data)
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
      <View>
        <Text style={[theme.fonts.titleLarge, { color: theme.colors.onSurface }]}>{note?.title}</Text>
      </View>
      <WebView originWhitelist={['*']} source={{ html: htmlContent }} style={{ flex: 1 }} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 44,
  },
})
