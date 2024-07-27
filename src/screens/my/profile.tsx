import {
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ScreenFC, ScrennTypeEnum } from '@/types/screen'
import { Text, useTheme } from 'react-native-paper'
import { TabBar, TabView } from 'react-native-tab-view'
import { Note, getAllNotes } from '@/service/articles'
import NoteList from './components/note-list'
const { width, height } = Dimensions.get('window')
import tw from 'twrnc'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from 'react-native-heroicons/outline'
import FolderManage from './components/folder-manage'
import { Folder } from '@/service/basic'
import { getCurrentFolderFromStorage, ICurrentFolder, saveCurrentFolderToStorage } from '@/utils/utilsStorage'
import { extractTextFromHTML } from '@/utils/utilsString'

const Profile: ScreenFC<ScrennTypeEnum.Profile> = ({ navigation }) => {
  const theme = useTheme()
  const [list, setlist] = useState<Partial<Note>[]>([])
  const [loading, setLoading] = useState(true)
  const [currentFolder, setCurrentFolder] = useState<ICurrentFolder>(null)

  const [drawerOpen, setDrawerOpen] = useState(false)

  const draftList = useMemo(() => {
    return list.filter(item => !item?.published)
  }, [list])
  const publishedList = useMemo(() => {
    return list.filter(item => item?.published)
  }, [list])

  type TabRoute = {
    key: string
    title: string
  }

  const [index, setIndex] = useState(0)
  const routes = useMemo<TabRoute[]>(() => {
    return [
      { key: 'first', title: 'Draft(' + draftList.length + ')' },
      { key: 'second', title: 'Published(' + publishedList.length + ')' },
    ]
  }, [draftList, publishedList])

  const onCheckFolderItem = (folder: Folder) => {
    const current = {
      id: folder.id,
      name: folder.name,
    }

    saveCurrentFolderToStorage(current)
    setCurrentFolder(current)

    setDrawerOpen(false)
  }

  const init = useCallback(() => {
    setLoading(true)
    getAllNotes(currentFolder?.id)
      .then(data => {
        const _data = data?.map(item => {
          item.titleText = extractTextFromHTML(item.title)
          return item
        })
        console.log('get current folder notes::', data)
        setlist(data)
      })
      .catch(err => {
        console.log('\x1b[31m%s\x1b[0m', 'get all note err:::', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [currentFolder])

  useEffect(() => {
    init()
  }, [currentFolder, init])

  useEffect(() => {
    // saveCurrentFolderToStorage
    getCurrentFolderFromStorage().then(data => {
      if (data) {
        setCurrentFolder(data)
      }
    })
  }, [])

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color={theme.colors.outline} />
      </View>
    )
  }

  const renderScene = ({ route }: { route: TabRoute }) => {
    switch (route.key) {
      case 'first':
        return (
          <View style={tw`flex-1 p-2`}>
            {draftList?.length > 0 ? (
              <NoteList
                list={draftList}
                onPressItem={item => navigation.navigate(ScrennTypeEnum.NodeDetail, { id: item.id })}
              />
            ) : (
              <Text>Null data</Text>
            )}
          </View>
        )
      case 'second':
        return (
          <View style={tw`flex-1 p-2`}>
            {publishedList?.length > 0 ? <NoteList list={publishedList} /> : <Text>Null data</Text>}
          </View>
        )
      default:
        return null
    }
  }

  return (
    <>
      <ScrollView contentContainerStyle={[{ flex: 1 }, tw`bg-gray-100`]}>
        <StatusBar hidden />
        <SafeAreaView style={[tw`flex-row justify-end items-center gap-3 py-2 px-2`]}>
          <MagnifyingGlassIcon size={20} color={theme.colors.onBackground} />
          <EllipsisVerticalIcon size={20} color={theme.colors.onBackground} />
        </SafeAreaView>
        {/* <Avatar /> */}
        <Pressable onPress={() => setDrawerOpen(!drawerOpen)}>
          <View style={tw` flex-row items-center gap-1 px-2 py-2`}>
            <Text style={[tw`font-bold`, { fontSize: 24 }]}>{currentFolder.name}</Text>
            {!drawerOpen ? (
              <ChevronDownIcon size={20} color={theme.colors.onBackground} />
            ) : (
              <ChevronUpIcon size={20} color={theme.colors.onBackground} />
            )}
          </View>
        </Pressable>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width }}
          tabBarPosition="bottom"
          renderTabBar={props => (
            <TabBar
              {...props}
              style={[{ height: 38 }, tw`bg-gray-50`]} // 自定义样式
              activeColor={theme.colors.primary}
              inactiveColor={theme.colors.onPrimaryContainer}
              indicatorStyle={{ backgroundColor: theme.colors.primary }}
            />
          )}
        />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(ScrennTypeEnum.CreateNote, { id: currentFolder.id })}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {drawerOpen && (
        <FolderManage
          currentFolder={currentFolder}
          style={[styles.fixedFooter, tw`flex-row bg-white`]}
          closeDrawer={() => setDrawerOpen(false)}
          onCheckFolderItem={onCheckFolderItem}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 40,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    elevation: 8,
    zIndex: 0,
  },
  fabText: {
    fontSize: 34,
    color: 'white',
  },

  fixedFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // height: 60,x
    minHeight: 200,
    width: 600,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    // justifyContent: 'center',
    // alignItems: 'center',
    zIndex: 9,
  },
})

export default Profile
