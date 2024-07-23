import React, { useRef, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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

const iconSize = 18

console.log('Object.keys(actions):::::', Object.values(actions))
const colorGray50 = 'rgb(249 250 251)'

const CreateNote = () => {
  const headingRichText = useRef<RichEditor>(null)
  const contentRichText = useRef<RichEditor>(null)
  const theme = useTheme()

  const [isFocus, setIsFocus] = useState(false)

  const save = () => {
    contentRichText?.current?.getContentHtml().then(html => {
      console.log('save value is:::', html)
    })
  }

  const contentTextUndo = () => contentRichText?.current?.sendAction(actions.undo, 'result')
  const contentTextRedo = () => contentRichText?.current?.sendAction(actions.redo, 'result')
  // editor.sendAction(action, 'result');
  const handleKeyPress = ({ key }: { keyCode: number; key: string }) => {
    if (key === 'Enter') {
      contentRichText?.current?.focusContentEditor()
      headingRichText?.current?.sendAction(actions.undo, 'result')
      return false
    }
  }

  return (
    <SafeAreaView style={[tw`flex-1 p-1 bg-gray-50`]}>
      <View style={[tw`justify-between items-center flex-row p-2`]}>
        <View style={tw`flex-row gap-2`}>
          <TouchableOpacity>
            <ArrowLeftIcon size={iconSize} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity>
            <XMarkIcon size={iconSize} color={theme.colors.onSurface} />
          </TouchableOpacity>
        </View>

        {isFocus && (
          <View style={tw`flex-row gap-2`}>
            <TouchableOpacity onPress={contentTextUndo}>
              <ArrowUturnLeftIcon size={iconSize} color={theme.colors.onSurface} />
            </TouchableOpacity>
            <TouchableOpacity onPress={contentTextRedo}>
              <ArrowUturnRightIcon size={iconSize} color={theme.colors.onSurface} />
            </TouchableOpacity>
          </View>
        )}

        <View style={tw`flex-row gap-2`}>
          <TouchableOpacity>
            <EllipsisVerticalIcon size={iconSize} color={theme.colors.onSurface} />
          </TouchableOpacity>
          {isFocus && (
            <TouchableOpacity onPress={save}>
              <CheckIcon size={iconSize} color={theme.colors.onSurface} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={[tw`flex-row gap-1 border-b-gray-200`, { paddingBottom: 4, borderBottomWidth: 1 }]}>
        <Text style={[{ fontSize: 10, color: theme.colors.onSecondaryContainer }]}>07/11/2023, 19:23</Text>
        <Text style={[{ fontSize: 10, color: theme.colors.secondaryContainer }]}>|</Text>
        <Text style={[{ fontSize: 10, color: theme.colors.onSecondaryContainer }]}>9</Text>
        <Text style={[{ fontSize: 10, color: theme.colors.secondaryContainer }]}>|</Text>
        <Text style={[{ fontSize: 10, color: theme.colors.onSecondaryContainer }]}>daily</Text>
      </View>
      <ScrollView style={[tw`flex-1 `]}>
        <RichEditor
          ref={headingRichText}
          style={styles.headingEditor}
          placeholder="Heading"
          initialContentHTML=""
          editorStyle={{ contentCSSText: 'font-size: 25px;', backgroundColor: colorGray50 }} // 设置字体大小为20px
          onKeyDown={handleKeyPress}
        />

        <RichEditor
          ref={contentRichText}
          style={styles.editor}
          placeholder="Start writing here..."
          initialContentHTML=""
          editorStyle={{ contentCSSText: 'font-size: 20px;', backgroundColor: colorGray50 }} // 设置字体大小为20px
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
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
