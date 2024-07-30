import {
  View,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { ScreenFC, ScrennTypeEnum } from '@/types/screen'
import { Text, useTheme } from 'react-native-paper'
import { batchUpdateNote, deleteNotes } from '@/service/articles'
const { width, height } = Dimensions.get('window')
import tw from 'twrnc'
import {
  ArrowRightStartOnRectangleIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline'
import FolderManage from './components/folder-manage'
import { Folder } from '@/service/basic'
import { saveCurrentFolderToStorage } from '@/utils/utilsStorage'
import FolderMovedTo from './components/folder-moved-to'
import { NoteProvider, useNote } from '@/context/note-provider'
import { TabBar, TabView } from 'react-native-tab-view'
import NodeListScreen from './components/node-list-screen'
import { messageConfirm } from '@/utils/utilsAlert'
import Toast from 'react-native-toast-message'
import NoteSearch from './components/note-search'

const TabScreenTypes = {
  draft: 'draft',
  published: 'published',
}

type TabRoute = {
  key: string
  title: string
}

const HEADER_MAX_HEIGHT = 100
const HEADER_MIN_HEIGHT = 60
const TITLE_MAX_MARGIN = 35 // Adjust this value based on your layout

const Profile: ScreenFC<ScrennTypeEnum.Profile> = ({ navigation }) => {
  const theme = useTheme()

  // const scrollY = new Animated.Value(0)
  const scrollY = useRef(new Animated.Value(0)).current

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  })
  const headerTextSize = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [34, 20],
    extrapolate: 'clamp',
  })

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [TITLE_MAX_MARGIN, -10],
    extrapolate: 'clamp',
  })

  const {
    noteList: list,
    noteLoading: loading,
    currentFolder,
    setCurrentFolder,
    refreshNote,
  } = useNote()

  const [showFolderManageDrawer, setShowFolderManageDrawer] = useState(false)
  const [showMovedDrawer, setShowMovedDrawer] = useState(false)
  const [showBottomActionBar, setShowBottomActionBar] = useState(false)
  const [showSearchNoteDrawer, setShowSearchNoteDrawer] = useState(false)
  const [checkedIds, setCheckedIds] = useState<string[]>([])

  const bottomActionDisabled = useMemo(() => !checkedIds.length, [checkedIds])

  const draftList = useMemo(() => {
    return list.filter(item => !item?.published)
  }, [list])
  const publishedList = useMemo(() => {
    return list.filter(item => item?.published)
  }, [list])

  const [index, setIndex] = useState(0)
  const routes = useMemo<TabRoute[]>(() => {
    return [
      { key: TabScreenTypes.draft, title: 'Draft(' + draftList.length + ')' },
      {
        key: TabScreenTypes.published,
        title: 'Published(' + publishedList.length + ')',
      },
    ]
  }, [draftList, publishedList])

  const bottomActionItemStyle = useMemo(() => {
    const color = bottomActionDisabled
      ? theme.colors.onSurfaceDisabled
      : theme.colors.onSurface
    return {
      color,
      iconProps: {
        size: 20,
        color,
      },
      textProps: {
        style: [
          theme.fonts.labelSmall,
          {
            color,
          },
        ],
      },
    }
  }, [bottomActionDisabled, theme])

  const onNoteCheckBoxChange = (ids: string[]) => {
    setCheckedIds(ids)
  }

  const moveNoteToFolderHandle = (folderId: string) => {
    if (!checkedIds?.length) return

    const docs = checkedIds.map(item => ({ folderId }))

    batchUpdateNote(checkedIds, docs)
      .then(res => {
        if (res) {
          console.log('update success!')
          setShowMovedDrawer(false)
          refreshNote()
        } else {
          console.log('update failed.')
        }
      })
      .catch(err => {
        console.log('update notes err:', err)
      })
  }

  const removeNotes = () => {
    if (!checkedIds?.length) return

    messageConfirm({
      message: `Are you sure to delete  these notes : [${[...checkedIds]}] ?`,
    }).then(() => {
      deleteNotes(checkedIds).then(res => {
        if (res) {
          Toast.show({
            type: 'success',
            position: 'top',
            text1: 'Operation successfuly',
            visibilityTime: 3000,
          })
        } else {
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Operation failed',
            visibilityTime: 3000,
          })
        }
      })
    })

    // deleteNotes(checkedIds)
  }

  const onCheckFolderItem = (folder: Folder) => {
    const current = {
      id: folder.id,
      name: folder.name,
    }

    saveCurrentFolderToStorage(current)
    setCurrentFolder(current)
    setShowFolderManageDrawer(false)
  }

  const renderScene = useCallback(
    ({ route }: { route: TabRoute }) => {
      switch (route.key) {
        case TabScreenTypes.draft:
          return (
            <Animated.ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[{ paddingTop: HEADER_MAX_HEIGHT }]}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false },
              )}
              scrollEventThrottle={16}
            >
              <NodeListScreen
                list={draftList}
                isShowBottomAction={showBottomActionBar}
                onNoteCheckBoxChange={onNoteCheckBoxChange}
                navigation={navigation}
              />
            </Animated.ScrollView>
          )

        case TabScreenTypes.published:
          return (
            <Animated.ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[{ paddingTop: HEADER_MAX_HEIGHT }]}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false },
              )}
              scrollEventThrottle={16}
            >
              <NodeListScreen
                list={publishedList}
                isShowBottomAction={showBottomActionBar}
                onNoteCheckBoxChange={onNoteCheckBoxChange}
                navigation={navigation}
              />
            </Animated.ScrollView>
          )
        default:
          return null
      }
    },
    [scrollY, draftList, showBottomActionBar, navigation, publishedList],
  )

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color={theme.colors.outline} />
      </View>
    )
  }

  return (
    <View style={[tw`bg-gray-50`, { height }]}>
      <StatusBar hidden />
      <Animated.View
        style={[
          styles.header,
          tw`flex-row  justify-start items-start pl-2 pt-3 bg-gray-50`,
          { height: headerHeight },
        ]}
      >
        {showBottomActionBar && (
          <TouchableOpacity onPress={() => setShowBottomActionBar(false)}>
            <XMarkIcon size={20} color={theme.colors.onBackground} />
          </TouchableOpacity>
        )}

        <Animated.View
          style={[{ transform: [{ translateY: titleTranslateY }] }]}
        >
          <Pressable
            onPress={() => setShowFolderManageDrawer(!showFolderManageDrawer)}
          >
            <View style={tw` flex-row items-center gap-1 px-2 py-2`}>
              <Animated.Text
                style={[
                  tw`font-bold`,
                  {
                    fontSize: headerTextSize,
                    color: theme.colors.onBackground,
                  },
                ]}
              >
                {currentFolder?.name}
              </Animated.Text>
              {!showFolderManageDrawer ? (
                <ChevronDownIcon size={20} color={theme.colors.onBackground} />
              ) : (
                <ChevronUpIcon size={20} color={theme.colors.onBackground} />
              )}
            </View>
          </Pressable>
        </Animated.View>

        <View
          style={[tw`flex-row justify-end items-center flex-1 gap-3 py-2 px-2`]}
        >
          <TouchableOpacity onPress={() => setShowSearchNoteDrawer(true)}>
            <MagnifyingGlassIcon size={20} color={theme.colors.onBackground} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowBottomActionBar(!showBottomActionBar)}
          >
            <PencilSquareIcon size={20} color={theme.colors.onBackground} />
          </TouchableOpacity>
        </View>
      </Animated.View>

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

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate(ScrennTypeEnum.CreateNote, {
            id: currentFolder?.id,
          })
        }
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* bottom action to edit note */}
      {showBottomActionBar && (
        <View style={[styles.fixedBottomsTabs]}>
          <View
            style={[
              { backgroundColor: 'rgba(255,255,255, 0.7)' },
              tw`flex-row justify-between items-center px-3 py-1`,
            ]}
          >
            <TouchableOpacity onPress={() => setShowMovedDrawer(true)}>
              <View style={tw` items-center `}>
                <ArrowRightStartOnRectangleIcon
                  {...bottomActionItemStyle.iconProps}
                />
                <Text {...bottomActionItemStyle.textProps}>Move</Text>
              </View>
            </TouchableOpacity>
            <View style={tw` items-center`}>
              <EyeSlashIcon {...bottomActionItemStyle.iconProps} />
              <Text {...bottomActionItemStyle.textProps}>Hide</Text>
            </View>
            <View style={tw` items-center`}>
              <ArrowUpIcon {...bottomActionItemStyle.iconProps} />
              <Text {...bottomActionItemStyle.textProps}>Pin</Text>
            </View>
            <TouchableOpacity style={tw` items-center`} onPress={removeNotes}>
              <TrashIcon {...bottomActionItemStyle.iconProps} />
              <Text {...bottomActionItemStyle.textProps}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Drawer */}
      {showFolderManageDrawer && (
        <FolderManage
          currentFolder={currentFolder}
          style={[styles.fixedFooter, tw`flex-row bg-white`]}
          closeDrawer={() => setShowFolderManageDrawer(false)}
          onCheckFolderItem={onCheckFolderItem}
        />
      )}
      {/* Drawer */}
      {showSearchNoteDrawer && (
        <NoteSearch
          style={[styles.fixedFooter, tw`flex-row bg-white`]}
          closeDrawer={() => setShowSearchNoteDrawer(false)}
          // onCheckFolderItem={onCheckFolderItem}
        />
      )}

      {showMovedDrawer && (
        <FolderMovedTo
          style={[styles.fixedFooter, tw`flex-row bg-white`]}
          closeDrawer={() => setShowMovedDrawer(false)}
          onMoveNoteToFolder={moveNoteToFolderHandle}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  fab: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 50,
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
    minHeight: 200,
    width: 600,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 9,
  },
  fixedBottomsTabs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#fff',
    zIndex: 90,
  },
})

const RenderComp = props => (
  <NoteProvider>
    <Profile {...props} />
  </NoteProvider>
)

export default RenderComp
