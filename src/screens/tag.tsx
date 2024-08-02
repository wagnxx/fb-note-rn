import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScreenFC, ScrennTypeEnum } from '@/types/screen'
import { getTags } from '@/service/basic'
import { List, useTheme } from 'react-native-paper'
import { XMarkIcon } from 'react-native-heroicons/outline'

const RightIcon = props => (
  <XMarkIcon size={20} color={props.color} onPress={props.onPress} />
)

const Tag: ScreenFC<ScrennTypeEnum.Tag> = () => {
  const theme = useTheme()

  const [tags, settags] = useState([])
  useEffect(() => {
    getTags()
      .then(data => {
        settags(data)
      })
      .catch(err => {
        console.log('get tag err:', err)
      })
  }, [])
  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <List.Section>
        {tags?.length > 0 &&
          tags.map((tag, index) => (
            <List.Item
              title={tag?.name}
              key={tag.id || index}
              right={RightIcon}
              style={{ borderBottomWidth: 1, borderBlockColor: '#ddd' }}
            />
          ))}
      </List.Section>
    </View>
  )
}
export default Tag
