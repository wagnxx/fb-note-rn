import {
  View,
  Text,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { useTheme } from 'react-native-paper'
import { Note, getAllPublishedNotes } from '../service/articles'
import { groupByTime, Grouped, transFBDate2Local } from '@/utils/utilsDate'
import { ScreenFC, ScrennTypeEnum } from '@/types/screen'
import { extractTextFromHTML } from '@/utils/utilsString'
import { Timestamp } from '@react-native-firebase/firestore'

// 使用 Partial<T> 可以处理其他字段是可选的情况
type PartialNote = Partial<Omit<Note, 'createTime'>> & { createTime: Timestamp }

const Moment: ScreenFC<ScrennTypeEnum.Moment> = ({ navigation }) => {
  const theme = useTheme()

  const [list, setlist] = useState<Partial<Note>[]>([])
  const [loading, setLoading] = useState(true)
  const [groupedNotes, setGroupedNotes] = useState<Grouped<PartialNote>>({
    today: [],
    yesterday: [],
    last7Days: [],
    last30Days: [],
    earlier: {},
  })

  useEffect(() => {
    setLoading(true)
    getAllPublishedNotes()
      .then(data => {
        setlist(data)
        setGroupedNotes(groupByTime<PartialNote>(data, 'createTime')) // 不需要传递时间字段，默认使用 'createTime'
      })
      .catch(err => {
        console.log('\x1b[31m%s\x1b[0m', 'get all note err:::', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <View style={[{ backgroundColor: theme.colors.background }, tw`flex-1 justify-center `]}>
      <StatusBar hidden={true} />

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.outline} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 12 }}>
          <View style={tw`justify-center flex-row px-2`}>
            <Text style={[theme.fonts.titleMedium]}>All published notes</Text>
          </View>
          {Object.keys(groupedNotes).map(group => (
            <View key={group}>
              {
                group === 'monthly' ? (
                  // 显示按月份分组的数据
                  <View>
                    {Object.keys(groupedNotes.monthly).length > 0 ? (
                      Object.keys(groupedNotes.monthly).map(month => (
                        <View key={month}>
                          <Text
                            style={[
                              theme.fonts.titleSmall,
                              { marginTop: 20, color: theme.colors.onBackground },
                            ]}
                          >
                            {month}
                          </Text>
                          {groupedNotes.monthly[month].map((item, index) => (
                            <ListItem
                              item={item}
                              key={index}
                              tw={tw}
                              theme={theme}
                              navigation={navigation}
                            />
                          ))}
                        </View>
                      ))
                    ) : (
                      <Text>No data for this month</Text>
                    )}
                  </View>
                ) : groupedNotes[group]?.length > 0 ? (
                  // 显示其他分组的数据
                  <>
                    <Text
                      style={[
                        theme.fonts.titleSmall,
                        { marginTop: 20, color: theme.colors.onBackground },
                      ]}
                    >
                      {group}
                    </Text>
                    {groupedNotes[group].map((item, index) => (
                      <ListItem
                        item={item}
                        key={index}
                        tw={tw}
                        theme={theme}
                        navigation={navigation}
                      />
                    ))}
                  </>
                ) : null // 不渲染任何内容，如果没有数据
              }
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  )
}

const ListItem = ({ item, navigation, theme, tw }) => (
  <View
    style={[
      tw`flex-row items-center justify-between mb-2 rounded-md`,
      // { backgroundColor: theme.colors.secondaryContainer },
    ]}
  >
    {/* <UserCircleIcon size={30} color={'#aaa'} /> */}
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(ScrennTypeEnum.NodeDetail, {
          id: item.id,
        })
      }
    >
      <Text
        style={[
          {
            color: theme.colors.onSecondaryContainer,
          },
          theme.fonts.bodyMedium,
        ]}
      >
        {extractTextFromHTML(item?.title)}
      </Text>
      <Text style={[theme.fonts.bodySmall, { color: theme.colors.onBackground }]}>
        {transFBDate2Local(item?.createTime as Timestamp)}
      </Text>
    </TouchableOpacity>
  </View>
)

export default Moment
