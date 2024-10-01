import { View, Text, TouchableOpacity } from 'react-native'
import React, { useMemo, useState } from 'react'
import { useDict } from '@/features/dict/uesDict'
import { setSelectedDictId } from '@/features/dict/dictSlice'
import { Button, Divider, useTheme } from 'react-native-paper'
import tw from 'twrnc'

const SelectDict = () => {
  const theme = useTheme()
  const { dictCollection, currentDictInfo } = useDict()

  const [showData, setShowData] = useState(false)

  const dictList = useMemo(() => {
    return dictCollection
      .filter(Boolean)
      .filter(item => item.length)
      .reduce((r, cur) => {
        if (!r.some(item => item.id === cur.id)) {
          r.push(cur)
        }
        return r
      }, [])
  }, [dictCollection])

  return (
    <View style={[tw` px-2 pb-10`]}>
      <View style={[tw`flex-row items-center`]}>
        <Text>colids:</Text>
        <Button onPress={() => setShowData(!showData)}>Show Data</Button>
      </View>
      {showData && <Text>{JSON.stringify(dictList, null, 2)}</Text>}
      <Divider style={[tw`my-2`]} />

      {dictList.map(dict => (
        <TouchableOpacity
          disabled={dict.id === currentDictInfo?.id}
          key={dict.id}
          onPress={() => dispatch(setSelectedDictId(dict.id))}
        >
          <Text
            disabled={dict.id === currentDictInfo?.id}
            style={{ color: theme.colors.onBackground }}
          >
            {dict.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default SelectDict
