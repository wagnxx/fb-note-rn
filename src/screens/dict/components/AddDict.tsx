import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import TabContentView from './TabContentView'
import { dictionaryResources } from '@/features/dict/dict_info'
import { useTheme } from 'react-native-paper'

const Tab = createBottomTabNavigator()
const categories = Array.from(new Set(dictionaryResources.map(item => item.category)))

const AddDict: React.FC = () => {
  const theme = useTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIcon: () => null,
        tabBarIconStyle: { display: 'none' },
        tabBarLabelPosition: 'beside-icon',
        headerShown: false,
        tabBarActiveBackgroundColor: theme.colors.background,
        tabBarInactiveBackgroundColor: theme.colors.background,
        tabBarActiveTintColor: theme.colors.onBackground,
      }}
    >
      {categories.map(category => (
        <Tab.Screen
          key={category}
          name={category}
          component={TabContentScreen} // Call the external component here
          initialParams={{ category }} // Pass category as route param
        />
      ))}
    </Tab.Navigator>
  )
}

// Extract the component definition out of the render
const TabContentScreen: React.FC<{ route: any }> = ({ route }) => {
  const { category } = route.params // Retrieve the category from the route params
  return <TabContentView category={category} />
}

export default AddDict
