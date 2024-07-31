import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  InteractionManager,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  ArrowLeftIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CheckIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline'
import { useTheme } from 'react-native-paper'
import { RichEditor, actions } from 'react-native-pell-rich-editor'
import tw from 'twrnc'
import ToolBar from './components/tool-bar'
import { RootStackParamList, ScreenFC, ScrennTypeEnum } from '@/types/screen'
import { createNote } from '@/service/articles'
import { RouteProp, useRoute } from '@react-navigation/native'
import { messageConfirm } from '@/utils/utilsAlert'
import { extractTextFromHTML } from '@/utils/utilsString'
import Toast from 'react-native-toast-message'
import { formatDate } from '@/utils/utilsDate'

const iconSize = 18

const colorGray50 = 'rgb(249 250 251)'

const CreateNote: ScreenFC<ScrennTypeEnum.CreateNote> = ({ navigation }) => {
  const headingRichText = useRef<RichEditor>(null)
  const contentRichText = useRef<RichEditor>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [lastupdte, setLastupdte] = useState('')
  const theme = useTheme()

  const [isFocus, setIsFocus] = useState(false)
  const [isFirstLoadWithoutInteraction, setIsFirstLoadWithoutInteraction] =
    useState(true)

  const {
    params: { id: folderId },
  } = useRoute<RouteProp<RootStackParamList>>()

  const contentLen = useMemo(() => content.length, [content])

  const handleEditorChange = (text, type) => {
    if (type === 'title') {
      setTitle(text)
    }
    if (type === 'content') {
      setContent(text)
    }
    if (isFirstLoadWithoutInteraction) {
      setIsFirstLoadWithoutInteraction(false)
    }
  }

  const save = async () => {
    if (!title || !content) return

    try {
      const titleText = extractTextFromHTML(title)
      await messageConfirm({
        message: `Are you sure you want to create Note ${titleText} ?`,
      })
      createNote({ title, content, folderId })
        .then(res => {
          if (res) {
            Toast.show({
              type: 'success',
              position: 'top',
              text1: 'create note success.',
              visibilityTime: 3000,
            })
            navigation.navigate(ScrennTypeEnum.Profile)
            setContent('')
            setTitle('')
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
  }

  const contentTextUndo = () =>
    contentRichText?.current?.sendAction(actions.undo, 'result')
  const contentTextRedo = () =>
    contentRichText?.current?.sendAction(actions.redo, 'result')
  // editor.sendAction(action, 'result');
  const handleKeyPress = ({ key }: { keyCode: number; key: string }) => {
    if (key === 'Enter') {
      contentRichText?.current?.focusContentEditor()
      headingRichText?.current?.sendAction(actions.undo, 'result')
      return false
    }
  }

  const goBack = () => {
    navigation.goBack()
  }

  useEffect(() => {
    const date = formatDate(new Date(), {
      customFormat: 'DD/MM/YYYY,HH:mm',
    })
    console.log('date:', date)
    setLastupdte(date)
  }, [])

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      headingRichText.current?.focusContentEditor()
    })

    return () => task.cancel()
  }, [])

  return (
    <SafeAreaView style={[tw`flex-1 p-1 bg-gray-50`]}>
      <View style={[tw`justify-between items-center flex-row p-2`]}>
        <View style={tw`flex-row gap-2`}>
          <TouchableOpacity onPress={goBack}>
            <ArrowLeftIcon size={iconSize} color={theme.colors.onSurface} />
          </TouchableOpacity>
          {isFirstLoadWithoutInteraction && (
            <TouchableOpacity onPress={goBack}>
              <XMarkIcon size={iconSize} color={theme.colors.onSurface} />
            </TouchableOpacity>
          )}
        </View>

        {isFocus && (
          <View style={tw`flex-row gap-2`}>
            <TouchableOpacity onPress={contentTextUndo}>
              <ArrowUturnLeftIcon
                size={iconSize}
                color={theme.colors.onSurface}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={contentTextRedo}>
              <ArrowUturnRightIcon
                size={iconSize}
                color={theme.colors.onSurface}
              />
            </TouchableOpacity>
          </View>
        )}

        <View style={tw`flex-row gap-2`}>
          <TouchableOpacity>
            <EllipsisVerticalIcon
              size={iconSize}
              color={theme.colors.onSurface}
            />
          </TouchableOpacity>
          {isFocus && (
            <TouchableOpacity onPress={save}>
              <CheckIcon size={iconSize} color={theme.colors.onSurface} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View
        style={[
          tw`flex-row gap-1 border-b-gray-200`,
          { paddingBottom: 4, borderBottomWidth: 1 },
        ]}
      >
        <Text
          style={[{ fontSize: 10, color: theme.colors.onSecondaryContainer }]}
        >
          {lastupdte}
        </Text>
        <Text
          style={[{ fontSize: 10, color: theme.colors.secondaryContainer }]}
        >
          |
        </Text>
        <Text
          style={[{ fontSize: 10, color: theme.colors.onSecondaryContainer }]}
        >
          {contentLen}
        </Text>
        <Text
          style={[{ fontSize: 10, color: theme.colors.secondaryContainer }]}
        >
          |
        </Text>
        <Text
          style={[{ fontSize: 10, color: theme.colors.onSecondaryContainer }]}
        >
          daily
        </Text>
      </View>
      <ScrollView style={[tw`flex-1  `]}>
        <RichEditor
          ref={headingRichText}
          style={styles.headingEditor}
          placeholder="Heading"
          initialContentHTML=""
          editorStyle={{
            contentCSSText: 'font-size: 25px;',
            backgroundColor: colorGray50,
          }} // 设置字体大小为20px
          onKeyDown={handleKeyPress}
          onChange={text => handleEditorChange(text, 'title')}
        />

        <RichEditor
          ref={contentRichText}
          style={styles.editor}
          placeholder="Start writing here..."
          initialContentHTML=""
          editorStyle={{
            contentCSSText: 'font-size: 20px;',
            backgroundColor: colorGray50,
          }} // 设置字体大小为20px
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={text => handleEditorChange(text, 'content')}
        />
      </ScrollView>
      <ToolBar editor={contentRichText} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  // },
  // scroll: {
  //   flex: 1,
  // },
  headingEditor: {
    // flex: 1,
    minHeight: 60,
    maxHeight: 80,
    padding: 0,
    // borderWidth: 1,
    borderColor: 'transparent',
    // borderRadius: 5,
    // minHeight: 300,
  },
  editor: {
    // flex: 1,
    paddingTop: 0,
    paddingBottom: 30,
    borderWidth: 0,
    borderColor: 'transparent',
    // borderRadius: 5,
    minHeight: 300,
  },
  toolbar: {
    // backgroundColor: '#eee',
    // borderTopWidth: 1,
    // borderColor: '#ccc',
  },
})

export default CreateNote
