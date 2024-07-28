import {
  View,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { ScreenFC, ScrennTypeEnum } from '@/types/screen'
import { Text, useTheme } from 'react-native-paper'
import { TabBar, TabView } from 'react-native-tab-view'
import { batchUpdateNote } from '@/service/articles'
const { width, height } = Dimensions.get('window')
import tw from 'twrnc'
import {
  ArrowRightStartOnRectangleIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline'
import FolderManage from './components/folder-manage'
import { Folder } from '@/service/basic'
import { saveCurrentFolderToStorage } from '@/utils/utilsStorage'
import FolderMovedTo from './components/folder-moved-to'
import { NoteProvider, useNote } from '@/context/note-provider'
import NodeListScreen from './components/node-list-screen'

const TabScreenTypes = {
  draft: 'draft',
  published: 'published',
}

type TabRoute = {
  key: string
  title: string
}

const Profile: ScreenFC<ScrennTypeEnum.Profile> = ({ navigation }) => {
  const theme = useTheme()

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
            <NodeListScreen
              list={draftList}
              isShowBottomAction={showBottomActionBar}
              onNoteCheckBoxChange={onNoteCheckBoxChange}
              navigation={navigation}
            />
          )

        case TabScreenTypes.published:
          return (
            <NodeListScreen
              list={publishedList}
              isShowBottomAction={showBottomActionBar}
              onNoteCheckBoxChange={onNoteCheckBoxChange}
              navigation={navigation}
            />
          )
        default:
          return null
      }
    },
    [draftList, showBottomActionBar, navigation, publishedList],
  )

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color={theme.colors.outline} />
      </View>
    )
  }

  return (
    <>
      <StatusBar hidden />
      <SafeAreaView style={tw`flex-row  justify-end items-center pl-2`}>
        {showBottomActionBar && (
          <TouchableOpacity onPress={() => setShowBottomActionBar(false)}>
            <XMarkIcon size={20} color={theme.colors.onBackground} />
          </TouchableOpacity>
        )}

        <View
          style={[tw`flex-row justify-end items-center flex-1 gap-3 py-2 px-2`]}
        >
          <MagnifyingGlassIcon size={20} color={theme.colors.onBackground} />
          <TouchableOpacity
            onPress={() => setShowBottomActionBar(!showBottomActionBar)}
          >
            <EllipsisVerticalIcon size={20} color={theme.colors.onBackground} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {/* <Avatar /> */}
      <Pressable
        onPress={() => setShowFolderManageDrawer(!showFolderManageDrawer)}
      >
        <View style={tw` flex-row items-center gap-1 px-2 py-2`}>
          <Text style={[tw`font-bold`, { fontSize: 24 }]}>
            {currentFolder?.name}
          </Text>
          {!showFolderManageDrawer ? (
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
            <View style={tw` items-center`}>
              <TrashIcon {...bottomActionItemStyle.iconProps} />
              <Text {...bottomActionItemStyle.textProps}>Delete</Text>
            </View>
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

      {showMovedDrawer && (
        <FolderMovedTo
          style={[styles.fixedFooter, tw`flex-row bg-white`]}
          closeDrawer={() => setShowMovedDrawer(false)}
          onMoveNoteToFolder={moveNoteToFolderHandle}
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
