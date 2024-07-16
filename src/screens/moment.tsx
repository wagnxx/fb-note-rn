import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { EyeIcon, UserCircleIcon } from 'react-native-heroicons/outline'
import { Button, useTheme } from 'react-native-paper'

export default function Moment({ navigation }) {
  const theme = useTheme()

  return (
    <View style={[{ backgroundColor: theme.colors.background }, tw`flex-1`]}>
      <StatusBar hidden={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 4 }}
      >
        <View style={tw`flex-row items-center justify-between mt-2`}>
          {/* <UserCircleIcon size={30} color={'#aaa'} /> */}
          <View>
            <Text
              style={[
                {
                  color: theme.colors.onBackground,
                },
                theme.fonts.titleMedium,
              ]}
            >
              This is published note
            </Text>
            <Text style={[{ color: theme.colors.secondary }]}>2024.12.01</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('DetailScreen')}>
            <EyeIcon size={30} color={theme.colors.secondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}
