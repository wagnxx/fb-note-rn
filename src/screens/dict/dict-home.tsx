/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { PageTypes } from './components/DictSettings'
import { Animated, Dimensions, StatusBar, Text, TouchableWithoutFeedback } from 'react-native'
import tw from 'twrnc'
import { View } from 'react-native'
import { useTheme } from 'react-native-paper'
import AddDict from './components/AddDict'
import SelectDict from './components/SelectDict'
import WordManage from './word-manage'
import { Bars3Icon, ChevronDoubleLeftIcon } from 'react-native-heroicons/outline'
import DictSettings from './components/DictSettings'
import { useDict } from '@/features/dict/uesDict'

const { width, height } = Dimensions.get('window')

const DictHome: React.FC = () => {
  const theme = useTheme()
  const { currentDictInfo } = useDict()
  const selectedDictId = useSelector((state: RootState) => state.dict.selectedDictId)
  const [pageType, setPageType] = useState<PageTypes>(null)

  const sidebarAnim = useRef(new Animated.Value(width)).current

  const setTargetPageType = useCallback(pType => {
    setPageType(pType)
    if (pType) {
      onAnimationEnd()
    }
  }, [])

  const onAnimationStart = () => {
    Animated.timing(sidebarAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const onAnimationEnd = () => {
    Animated.timing(sidebarAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  useEffect(() => {
    if (!selectedDictId) {
      onAnimationStart()
    }
  }, [selectedDictId])

  return (
    <View style={[tw`flex-auto`]}>
      <StatusBar hidden={true} />
      <Animated.View
        style={[
          tw` absolute z-10`,
          { width: width, height: height },
          { transform: [{ translateX: sidebarAnim }], backgroundColor: theme.colors.background },
        ]}
      >
        <TouchableWithoutFeedback onPress={onAnimationEnd}>
          <View style={[tw`h-full`, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
            <TouchableWithoutFeedback>
              <View style={[tw`w-1/2, h-full`, { backgroundColor: theme.colors.surface }]}>
                <View style={[tw`flex-row justify-end py-2 px-2`]}>
                  <ChevronDoubleLeftIcon
                    size={20}
                    color={theme.colors.onBackground}
                    onPress={onAnimationEnd}
                  />
                </View>
                <DictSettings setPageType={setTargetPageType} style={{}} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>

      <View style={[tw`flex-row justify-between items-center px-2 py-2`]}>
        <Bars3Icon size={24} color={theme.colors.onBackground} onPress={onAnimationStart} />
        <Text style={[theme.fonts.labelMedium]}>CURRENT DICT: {currentDictInfo?.name || '_'}</Text>
      </View>

      {pageType === 'add_dict' && <AddDict />}
      {pageType === 'select_dict' && <SelectDict />}
      {(pageType === 'word_manage' || (pageType === null && selectedDictId)) && <WordManage />}
    </View>
  )
}

export default DictHome
