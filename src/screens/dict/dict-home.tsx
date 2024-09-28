import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import DictManage, { PageTypes } from './dict-manage'
import { Animated, Dimensions } from 'react-native'
import tw from 'twrnc'
import { View } from 'react-native'
import { useTheme } from 'react-native-paper'
import AddDict from './components/AddDict'
import SelectDict from './components/SelectDict'
import WordManage from './word-manage'
import { Bars3Icon, ChevronDoubleLeftIcon } from 'react-native-heroicons/outline'

const { width, height } = Dimensions.get('window')

const DictHome: React.FC = () => {
  const theme = useTheme()
  const selectedDictId = useSelector((state: RootState) => state.dict.selectedDictId)
  const [pageType, setPageType] = useState<PageTypes>(null)

  const sidebarAnim = useRef(new Animated.Value(width)).current

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

  return (
    <View style={[tw`flex-auto`]}>
      <Animated.View
        style={[
          tw` absolute z-10`,
          { width: width / 2, height: height },
          { transform: [{ translateX: sidebarAnim }], backgroundColor: theme.colors.background },
        ]}
      >
        <View style={[tw`flex-row justify-end pr-2 px-2`]}>
          <ChevronDoubleLeftIcon
            size={20}
            color={theme.colors.onBackground}
            onPress={onAnimationEnd}
          />
        </View>
        <DictManage setPageType={setPageType} />
      </Animated.View>

      <View>
        <Bars3Icon size={20} color={theme.colors.onBackground} onPress={onAnimationStart} />
      </View>

      {pageType === 'add_dict' && <AddDict />}
      {pageType === 'select_dict' && <SelectDict />}
      {pageType === 'word_manage' && <WordManage />}
    </View>
  )

  // return isDictHome || !selectedDictId ? (
  //   <DictManage setIsDictHome={setIsDictHome} />
  // ) : (
  //   <WordManage backDictHome={() => setIsDictHome(true)} />
  // )
}

export default DictHome
