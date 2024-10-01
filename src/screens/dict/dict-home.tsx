import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { createPersonWordsCol, updateWordsCol } from '@/service/dict'
import StorageManage from './components/StorageManage'
import { loadDictCollection, loadSelectedDict } from '@/features/dict/dictSlice'

const { width, height } = Dimensions.get('window')

const DictHome = (props, ref) => {
  const theme = useTheme()
  const { currentDictInfo, hasWordsCollectionChanged, wordsDocId, wordsCollection, wordsRemoved } =
    useDict()
  const selectedDictId = useSelector((state: RootState) => state.dict.selectedDictId)
  const [pageType, setPageType] = useState<PageTypes>(null)

  const sidebarAnim = useRef(new Animated.Value(width)).current

  const dispatch = useDispatch()

  const onAnimationStart = useCallback(() => {
    Animated.timing(sidebarAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [sidebarAnim])

  const onAnimationEnd = useCallback(() => {
    Animated.timing(sidebarAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [sidebarAnim])

  const setTargetPageType = useCallback(
    (pType: PageTypes) => {
      setPageType(pType)
      if (pType) {
        onAnimationEnd()
      }
    },
    [onAnimationEnd],
  )
  useEffect(() => {
    if (!selectedDictId) {
      onAnimationStart()
    }
  }, [onAnimationStart, selectedDictId])

  useEffect(() => {
    loadSelectedDict(dispatch)()
    loadDictCollection(dispatch)()
  }, [dispatch])

  useImperativeHandle(ref, () => {
    return {
      saveData() {
        console.log(
          ' =========================== App is in the background, saving data...===========================',
        )
        if (hasWordsCollectionChanged) {
          console.log('hasWordsCollectionChanged in forwardRef comp:::')
          if (wordsDocId) {
            // update
            updateWordsCol({
              archived: wordsCollection,
              removed: wordsRemoved,
              id: wordsDocId,
            }).then(res => {
              if (res) {
                console.log('update success.')
              } else {
                console.log('update failed')
              }
            })
          } else {
            // create
            createPersonWordsCol({
              archived: wordsCollection,
              removed: wordsRemoved,
            }).then(res => {
              if (res) {
                console.log('create success.')
              } else {
                console.log('create failed')
              }
            })
          }
        }
      },
    }
  }, [hasWordsCollectionChanged, wordsCollection, wordsDocId, wordsRemoved])

  return (
    <View style={[tw`flex-auto`, { backgroundColor: theme.colors.background }]}>
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
        <Text style={[theme.fonts.labelMedium, { color: theme.colors.onBackground }]}>
          CURRENT DICT: {currentDictInfo?.name || '_'}
        </Text>
      </View>

      {pageType === 'add_dict' && <AddDict />}
      {pageType === 'select_dict' && <SelectDict />}
      {pageType === 'storage_manage' && <StorageManage />}
      {(pageType === 'word_manage' || (pageType === null && selectedDictId)) && <WordManage />}
    </View>
  )
}

export default forwardRef(DictHome)
