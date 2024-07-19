import { Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RootStackParamList, ScreenProps, ScrennTypeEnum } from '@/types/screen'
import { RouteProp, useRoute } from '@react-navigation/native'
import { getNote } from '@/service/articles'

export default function NodeDetail({ navigation }: ScreenProps<ScrennTypeEnum.NodeDetail>) {
  const { params } = useRoute<RouteProp<RootStackParamList>>()
  const [note, setNote] = useState('')

  const fetchNote = (id: string) => {
    getNote(id).then(note => {
      if (note) {
        setNote(note)
      } else {
        setNote('')
      }
    })
  }

  useEffect(() => {
    if (params?.id) {
      fetchNote(params.id)
    }
  }, [params])

  return <Text>{note?.content}</Text>
}
