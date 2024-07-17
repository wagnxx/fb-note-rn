import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { EyeIcon } from 'react-native-heroicons/outline'
import { useTheme } from 'react-native-paper'
import { getAllPublishedNotes } from '../service/articles'
import { transFBDate2Local } from '@/utils/utilsDate'

export default function Moment({ navigation }) {
  const theme = useTheme()

  const [list, setlist] = useState([])

  useEffect(() => {
    getAllPublishedNotes()
      .then(data => {
        console.log('note data:::::', data)
        setlist(data)
      })
      .catch(err => {
        console.log()
        console.log('\x1b[31m%s\x1b[0m', 'get all note err:::', err)
      })
  }, [])

  return (
    <View style={[{ backgroundColor: theme.colors.background }, tw`flex-1`]}>
      <StatusBar hidden={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 4 }}
      >
        {list?.length > 0 &&
          list.map((item, index) => (
            <View
              style={tw`flex-row items-center justify-between mt-2`}
              key={index}
            >
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
                  {item.title}
                </Text>
                <Text style={[{ color: theme.colors.secondary }]}>
                  {transFBDate2Local(item.createTime)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('DetailScreen')}
              >
                <EyeIcon size={30} color={theme.colors.secondary} />
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
    </View>
  )
}
