import { View, Text } from 'react-native'
import React from 'react'
import { ScreenFC, ScrennTypeEnum } from '@/types/screen'

const Profile: ScreenFC<ScrennTypeEnum.Profile> = () => {
  return (
    <View>
      <Text>Profile</Text>
    </View>
  )
}
export default Profile
