import React, { useCallback, useMemo, useRef, useState } from 'react'
import tw from 'twrnc'
import { Searchbar, useTheme } from 'react-native-paper'
import RowItem from './RowItem'
import { Animated, FlatList, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native'
import { useDict } from '@/features/dict/uesDict'
import { ListBulletIcon, Squares2X2Icon } from 'react-native-heroicons/outline'
import { eventBus } from '@/utils/utilsEventBus'

const WordListComponent: React.FC<{ showMeaning: boolean }> = ({ showMeaning }) => {
  const { currentWordList, wordsRemoved } = useDict()
  const theme = useTheme()

  // 动画和滚动状态
  const scrollY = useRef(new Animated.Value(0)).current
  const [lastOffset, setLastOffset] = useState(0)

  // 布局类型状态
  const [layoutType, setLayoutType] = useState<'list' | 'grid'>('list')

  // 搜索查询状态
  const [searchQuery, setSearchQuery] = useState('')

  // 切换布局类型
  const toggleLayoutType = useCallback(() => {
    setLayoutType(prev => (prev === 'list' ? 'grid' : 'list'))
  }, [])

  // 过滤后的单词列表
  const wordList = useMemo(() => {
    return (
      currentWordList
        ?.filter(Boolean)
        .filter(item => item.name.includes(searchQuery))
        .filter(item => wordsRemoved.some(r => r.name !== item.name)) || []
    )
  }, [currentWordList, searchQuery, wordsRemoved])

  // 滚动事件处理
  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: false,
    listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentOffset = event.nativeEvent.contentOffset.y
      const visible = currentOffset < lastOffset // 比较当前偏移量
      eventBus.emit('update-tabVisible', visible)
      setLastOffset(currentOffset)
    },
  })

  return (
    <View style={[tw`h-full`, { backgroundColor: theme.colors.background }]}>
      <View style={[tw`flex-row gap-2 justify-between items-center px-2 my-2`]}>
        <View style={[tw`flex-1`]}>
          <Searchbar placeholder="Search" onChangeText={setSearchQuery} value={searchQuery} />
        </View>
        {layoutType === 'list' && (
          <ListBulletIcon size={20} color={theme.colors.onBackground} onPress={toggleLayoutType} />
        )}
        {layoutType === 'grid' && (
          <Squares2X2Icon size={20} color={theme.colors.onBackground} onPress={toggleLayoutType} />
        )}
      </View>
      <FlatList
        data={wordList}
        keyExtractor={item => item.name.toString()}
        renderItem={({ item }) => (
          <RowItem item={item} showMeaning={showMeaning} isLayoutGrid={layoutType === 'grid'} />
        )}
        style={[tw`px-2 `, { backgroundColor: theme.colors.background }]}
        numColumns={layoutType === 'list' ? 1 : 4}
        key={layoutType === 'list' ? 1 : 4}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    </View>
  )
}

export default WordListComponent
