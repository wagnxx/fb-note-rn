import { View, Dimensions, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CreateHTMLNote from './components/html-editor'
import { RootStackParamList, ScreenFC, ScrennTypeEnum } from '@/types/screen'
import tw from 'twrnc'
import { Button, useTheme } from 'react-native-paper'
import MarkdownEditor from './components/markdown-editor'
import UnionPage from '@/components/union-page'
import { messageConfirm } from '@/utils/utilsAlert'
import { extractTextFromHTML } from '@/utils/utilsString'
import { createNote, getNote, Note, updateNote } from '@/service/articles'
import Toast from 'react-native-toast-message'
import { RouteProp, useRoute } from '@react-navigation/native'
const { width: screenWidth } = Dimensions.get('window')

export const DOC_TYPES = {
  md: 'md',
  html: 'html',
} as const // 使用 as const 确保类型是字面量

export type DocType = (typeof DOC_TYPES)[keyof typeof DOC_TYPES] | null // 这样会得到 'md' | 'html' | null

const CreateNote: ScreenFC<ScrennTypeEnum.CreateNote> = ({ navigation }) => {
  const [note, setNote] = useState<Note | null>(null) // init data
  const unionPageRef = useRef<{ show: () => void }>()
  const [docType, setdocType] = useState<DocType>(null)
  // const navigation = useNavigation()
  const theme = useTheme()
  const { params } = useRoute<RouteProp<RootStackParamList>>()

  const setDoctTypeHandle = (typ: DocType) => {
    setdocType(typ)
    unionPageRef?.current?.show()
  }

  const saveDocHandler = useCallback(
    async ({ title, content }) => {
      if (!title || !content) return

      try {
        const titleText = extractTextFromHTML(title)
        await messageConfirm({
          message: `Are you sure you want to create Note ${titleText} ?`,
        })

        let actionFn
        const actionParams = { title, content, folderId: params?.id, docType }

        if (params?.docId) {
          actionFn = updateNote
          actionParams.id = params.docId
        } else {
          actionFn = createNote
        }

        return actionFn(actionParams)
          .then(res => {
            if (res) {
              Toast.show({
                type: 'success',
                position: 'top',
                text1: 'create note success.',
                visibilityTime: 3000,
              })
              navigation.navigate(ScrennTypeEnum.Profile)
            } else {
              Toast.show({
                type: 'info',
                position: 'top',
                text1: 'create note failed',
                visibilityTime: 3000,
              })
            }
          })
          .catch(err => {
            console.log('create note error:::', err)
          })
      } catch (error) {}
    },
    [docType, navigation, params],
  )

  const mainPage = useMemo(() => {
    if (docType === DOC_TYPES.html)
      return <CreateHTMLNote onSave={saveDocHandler} initNote={note} />
    if (docType === DOC_TYPES.md) return <MarkdownEditor onSave={saveDocHandler} initNote={note} />
    return null
  }, [docType, note, saveDocHandler])

  const fetchNote = useCallback(() => {
    if (!params?.docId) return
    getNote(params.docId).then(data => {
      if (data) {
        setNote(data)
        const dtype = data.docType || 'html'
        setDoctTypeHandle(dtype)
      } else {
        setNote(null)
      }
    })
  }, [params])

  useEffect(() => {
    fetchNote()
  }, [fetchNote])

  const guideJSX = (
    <View style={styles.container}>
      <Button
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonLabel}
        onPress={() => setDoctTypeHandle(DOC_TYPES.html)}
      >
        Create HTML
      </Button>
      <Button
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonLabel}
        onPress={() => setDoctTypeHandle(DOC_TYPES.md)}
      >
        Create Markdown
      </Button>
    </View>
  )

  return (
    <View style={[tw`flex-1`, { backgroundColor: theme.colors.secondaryContainer }]}>
      <UnionPage ref={unionPageRef} guidePage={guideJSX} targetPage={mainPage} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: '#6200ea', // 自定义背景颜色
    borderRadius: 8, // 圆角
    paddingVertical: 10, // 垂直内边距
    paddingHorizontal: 10, // 水平内边距
    elevation: 4, // 阴影效果
  },
  buttonLabel: {
    fontSize: 16, // 字体大小
    fontWeight: 'bold', // 字体加粗
  },
})

export default CreateNote
