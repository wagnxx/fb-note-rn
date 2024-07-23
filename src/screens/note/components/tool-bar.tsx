import { SafeAreaView, View } from 'react-native'
import React, { RefObject, useEffect, useMemo, useState } from 'react'
import { Text, useTheme } from 'react-native-paper'
import { RichEditor, actions } from 'react-native-pell-rich-editor'
import ToolActions from './tool-actions'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { CheckCircleIcon } from 'react-native-heroicons/outline'
type ToolBarProps = {
  editor: RefObject<RichEditor>
}
export default function ToolBar({ editor }: ToolBarProps) {
  const theme = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const onCheckedPress = () => editor?.current?.sendAction(actions.checkboxList, 'result')

  const [selectedItems, setSelectedItems] = useState([])

  const isChecked = useMemo(() => {
    return selectedItems.find(item => item?.type === 'checkboxList')
  }, [selectedItems])

  useEffect(() => {
    editor?.current?.registerToolbar(items => {
      // console.log(items)
      setSelectedItems(items)
    })
  }, [editor])

  return (
    <SafeAreaView>
      <View
        style={{
          backgroundColor: '#fff',
          padding: 10,
          flexDirection: 'row',
          gap: 16,
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={onCheckedPress}>
          <CheckCircleIcon size={22} color={isChecked ? theme.colors.primary : theme.colors.onBackground} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
          <Text style={[{ color: isOpen ? theme.colors.primary : theme.colors.onBackground }]}>Aa</Text>
        </TouchableOpacity>
      </View>
      {isOpen && <ToolActions editor={editor} selectedItems={selectedItems} />}
    </SafeAreaView>
  )
}
