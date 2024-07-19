import React, { useRef, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import {
  ArrowLeftIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  CheckIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline'
import { useTheme } from 'react-native-paper'
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor'
import tw from 'twrnc'

const iconSize = 18

const CreateNote = () => {
  const richText = useRef(null)
  const theme = useTheme()

  const [isFocus, setIsFocus] = useState(false)

  const save = () => {
    richText?.current?.getContentHtml().then(html => {
      console.log('save value is:::', html)
    })
  }

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
      <View style={[tw`justify-between items-center flex-row p-2`, { backgroundColor: theme.colors.surface }]}>
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
            <ArrowUturnLeftIcon size={iconSize} color={theme.colors.onSurface} />
            <ArrowUturnRightIcon size={iconSize} color={theme.colors.onSurface} />
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
      <ScrollView style={[tw`flex-1 border-red-700`, { borderWidth: 1 }]}>
        <RichEditor
          ref={richText}
          style={styles.editor}
          placeholder="Start writing here..."
          initialContentHTML="<h1>Hello World</h1><p>This is a <b>bold</b> paragraph.</p>"
          editorStyle={{ contentCSSText: 'font-size: 20px;' }} // 设置字体大小为20px
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
      </ScrollView>
      <RichToolbar
        editor={richText}
        actions={[
          actions.insertImage,
          actions.setBold,
          actions.setItalic,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          actions.setStrikethrough,
          actions.setUnderline,
          actions.setParagraph,
        ]}
        style={[styles.toolbar, { backgroundColor: theme.colors.surface }]}
      />
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
  editor: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    // minHeight: 300,
  },
  toolbar: {
    // backgroundColor: '#eee',
    // borderTopWidth: 1,
    // borderColor: '#ccc',
  },
})

export default CreateNote
