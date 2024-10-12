import { useNavigation } from '@react-navigation/native'
import React, { useRef, useState } from 'react'
import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import { color } from 'react-native-elements/dist/helpers'
import { CheckIcon } from 'react-native-heroicons/outline'
import ArrowLeftIcon from 'react-native-heroicons/outline/ArrowLeftIcon'

import { TextInput, useTheme } from 'react-native-paper'
import tw from 'twrnc'

const { height: screenHeight } = Dimensions.get('window')
const iconSize = 18
const MarkdownEditor = ({ onSave }) => {
  const [title, setconTitle] = useState('')
  const [content, setcontent] = useState('')
  const [isFocus, setIsFocus] = useState(false)

  const bodyRef = useRef(null)

  const theme = useTheme()
  const editorBgColor = color(theme.colors.surface).alpha(0.75).string()

  const navigation = useNavigation()

  const onKeyPressHandle = e => {
    bodyRef.current.focus()
  }

  const goBack = () => {
    navigation.goBack()
  }

  const save = async () => {
    if (!title || !content) return

    onSave({
      title,
      content,
    }).then(() => {
      console.log('onSave end.')
    })
  }

  return (
    <View style={[tw`flex-1 py-2`, { backgroundColor: theme.colors.background }]}>
      <View style={tw`flex-row gap-2`}>
        <TouchableOpacity onPress={goBack}>
          <ArrowLeftIcon size={iconSize} color={theme.colors.onSurface} />
        </TouchableOpacity>
        {isFocus && (
          <TouchableOpacity onPress={save}>
            <CheckIcon size={iconSize} color={theme.colors.onSurface} />
          </TouchableOpacity>
        )}
      </View>
      <View style={[{ backgroundColor: theme.colors.surface }]}>
        <View
          style={[
            tw`flex-row justify-end px-1 pt-1`,
            { backgroundColor: color(theme.colors.onBackground).alpha(0.8).string() },
          ]}
        >
          <Text style={[theme.fonts.labelSmall, { color: theme.colors.background }]}>markdown</Text>
        </View>
        <TextInput
          mode="flat"
          value={title}
          onChangeText={text => setconTitle(text)}
          style={{
            marginTop: 0,
            borderBlockColor: 'red',
            borderWidth: 0,
            padding: 0,
            backgroundColor: editorBgColor,
          }}
          onSubmitEditing={onKeyPressHandle}
        />
        <TextInput
          ref={bodyRef}
          multiline={true}
          value={content}
          onChangeText={text => setcontent(text)}
          style={{
            borderBlockColor: 'red',
            borderWidth: 0,
            padding: 0,
            minHeight: screenHeight - 100,
            backgroundColor: editorBgColor,
          }}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
      </View>
    </View>
  )
}

export default MarkdownEditor
