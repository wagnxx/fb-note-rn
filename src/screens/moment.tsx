import { View, Text, StatusBar, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { EyeIcon } from 'react-native-heroicons/outline'
import { useTheme } from 'react-native-paper'
import { getAllPublishedNotes } from '../service/articles'
import { transFBDate2Local } from '@/utils/utilsDate'
import { ScreenFC, ScrennTypeEnum } from '@/types/screen'

const Moment: ScreenFC<ScrennTypeEnum.Moment> = ({ navigation }) => {
  const theme = useTheme()

  const [list, setlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getAllPublishedNotes()
      .then(data => {
        console.log('note data:::::', data)
        setlist(data)
      })
      .catch(err => {
        console.log('\x1b[31m%s\x1b[0m', 'get all note err:::', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <View style={[{ backgroundColor: theme.colors.background }, tw`flex-1 justify-center`]}>
      <StatusBar hidden={true} />

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.outline} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12 }}>
          {list?.length > 0 ? (
            list.map((item, index) => (
              <View style={tw`flex-row items-center justify-between mt-2`} key={index}>
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
                  <Text style={[{ color: theme.colors.secondary }]}>{transFBDate2Local(item.createTime)}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('DetailScreen')}>
                  <EyeIcon size={30} color={theme.colors.secondary} />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text>Null data</Text>
          )}
        </ScrollView>
      )}
    </View>
  )
}
export default Moment
