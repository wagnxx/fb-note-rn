import { View, Text, TouchableOpacity } from 'react-native'
import React, { FC, useMemo, useState } from 'react'
import { useDict } from '@/features/dict/uesDict'
import { setSelectedDictId } from '@/features/dict/dictSlice'
import { Button, Divider, useTheme } from 'react-native-paper'
import tw from 'twrnc'
import { useDispatch } from 'react-redux'
import { PageTypes } from './DictSettings'
import { DictInfo } from '@/features/dict/dict_info'

const MAX_DICT_COUNT = 2

const SelectDict: FC<{ setTargetPageType: (pType: PageTypes) => void }> = ({
  setTargetPageType,
}) => {
  const theme = useTheme()
  const { dictCollection, currentDictInfo } = useDict()

  const [showData, setShowData] = useState(false)

  const dispatch = useDispatch()

  const dictList: DictInfo[] = useMemo(() => {
    return dictCollection
      .filter(Boolean)
      .filter(item => item.length)
      .reduce((r, cur) => {
        if (!r.some(item => item.id === cur.id)) {
          r.push(cur)
        }
        return r
      }, [] as DictInfo[])
  }, [dictCollection])

  return (
    <View style={[tw` px-2 pb-10`]}>
      <View style={[tw`flex-row items-center`]}>
        <Text>colids:</Text>
        <Button onPress={() => setShowData(!showData)}>Show Data</Button>
        <Button
          onPress={() => setTargetPageType('add_dict')}
          disabled={dictList.length >= MAX_DICT_COUNT}
        >
          Add Dict
        </Button>
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
