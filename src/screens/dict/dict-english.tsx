import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import NewWordsList from './new-words-list'
import WordsManage from './words-manage'

const Tab = createBottomTabNavigator()

export default function DictEnglish() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name={'NewWordsList'} component={NewWordsList} />
      <Tab.Screen name={'WordManage'} component={WordsManage} />
    </Tab.Navigator>
  )
}
