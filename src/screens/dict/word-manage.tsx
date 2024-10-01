import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import WordListComponent from './components/WordListComponent'
import { useDict } from '@/features/dict/uesDict'
import { StatusBar, Text, View } from 'react-native'
import { Button, useTheme } from 'react-native-paper'
import tw from 'twrnc'
import WordArchived from './components/WordArchived'
import WordRemoved from './components/WordRemoved'
import { getCurrentUserWordsCol } from '@/service/dict'
import { useDispatch } from 'react-redux'
import { setWordCollections, setWordRemoved, setWordsDocId } from '@/features/dict/dictSlice'
import { eventBus } from '@/utils/utilsEventBus'

const Tab = createBottomTabNavigator()

const WordManage: React.FC<{ backDictHome?: () => void }> = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const [tabVisible, setTabVisible] = useState(true)

  useEffect(() => {
    getCurrentUserWordsCol().then(data => {
      console.log('getCurrentUserWordsCol data:', data)
      if (!data?.length) return
      const row = data[0]
      dispatch(setWordsDocId(row.id!))
      dispatch(setWordCollections(row.archived))
      dispatch(setWordRemoved(row.removed))
    })
  }, [dispatch])

  useEffect(() => {
    const listener = (message: boolean) => {
      setTabVisible(message)
    }

    eventBus.on<boolean>('update-tabVisible', listener)
    return () => {
      eventBus.off<boolean>('update-tabVisible', listener) // 清理
    }
  }, [])

  return (
    <View style={[tw`flex-1`, { backgroundColor: theme.colors.background }]}>
      <StatusBar hidden={true} />
      <Tab.Navigator
        screenOptions={{
          tabBarIcon: () => null,
          tabBarIconStyle: { display: 'none' },
          tabBarLabelPosition: 'beside-icon',
          headerShown: false,
          tabBarStyle: { display: tabVisible ? 'flex' : 'none' },

          tabBarActiveBackgroundColor: theme.colors.background,
          tabBarInactiveBackgroundColor: theme.colors.background,
          tabBarActiveTintColor: theme.colors.onBackground,
        }}
      >
        <Tab.Screen
          key={'1'}
          name={'wordList'}
          component={WordListScreen} // Call the external component here
        />
        <Tab.Screen
          key={'2'}
          name={'Archive'}
          component={WordArchived} // Call the external component here
        />
        <Tab.Screen
          key={'3'}
          name={'Removed'}
          component={WordRemoved} // Call the external component here
        />
      </Tab.Navigator>
    </View>
  )
}

// Extract the component definition out of the render
const WordListScreen: React.FC<{ route: any }> = ({ route }) => {
  const theme = useTheme()
  const [showMeaning, setshowMeaning] = useState(false)
  const { wordsCount } = useDict()
  return (
    <View>
      <View
        style={[
          tw`flex-row justify-between items-center px-2`,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[{ color: theme.colors.onBackground }]}>COUNT({wordsCount})</Text>
        <Button onPress={() => setshowMeaning(!showMeaning)}>Show Meaning</Button>
      </View>
      <WordListComponent showMeaning={showMeaning} />
    </View>
  )
}

export default WordManage
