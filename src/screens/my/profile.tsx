import { View, ScrollView, Dimensions, ActivityIndicator, StatusBar, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { ScreenFC, ScrennTypeEnum } from '@/types/screen'
import { Text, useTheme } from 'react-native-paper'
import { TabBar, TabView } from 'react-native-tab-view'
import { Note, getAllNotes } from '@/service/articles'
import NoteList from './components/note-list'
const { width, height } = Dimensions.get('window')
import tw from 'twrnc'

const Profile: ScreenFC<ScrennTypeEnum.Profile> = ({ navigation }) => {
  const theme = useTheme()
  const [list, setlist] = useState<Partial<Note>[]>([])
  const [loading, setLoading] = useState(true)

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

  const init = () => {
    setLoading(true)
    getAllNotes()
      .then(data => {
        setlist(data)
      })
      .catch(err => {
        console.log('\x1b[31m%s\x1b[0m', 'get all note err:::', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    init()
  }, [])

  if (loading) {
    return <ActivityIndicator size="large" color={theme.colors.outline} />
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
    <ScrollView contentContainerStyle={[{ backgroundColor: theme.colors.background, flex: 1 }]}>
      <StatusBar hidden />
      {/* <Avatar /> */}
      <View style={tw` flex-row px-2 py-2`}>
        <Text style={tw`font-bold`}>Default Folder</Text>
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            style={[{ height: 38, backgroundColor: theme.colors.background }]} // 自定义样式
            activeColor={theme.colors.primary}
            inactiveColor={theme.colors.onPrimaryContainer}
            indicatorStyle={{ backgroundColor: theme.colors.primary }}
          />
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate(ScrennTypeEnum.CreateNote)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    elevation: 8,
  },
  fabText: {
    fontSize: 34,
    color: 'white',
  },
})

export default Profile
