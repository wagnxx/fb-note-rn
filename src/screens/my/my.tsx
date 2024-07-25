import { View, ScrollView } from 'react-native'
import React, { useContext } from 'react'
import { ScreenFC, ScrennTypeEnum } from '@/types/screen'
import { AuthContext } from '@/context/auth-provider'
import ProfileList from './components/profile-list'
import Avatar from './components/avatar'
import tw from 'twrnc'

const Ny: ScreenFC<ScrennTypeEnum.My> = ({ navigation }) => {
  const { user } = useContext(AuthContext)
  return (
    <ScrollView>
      <Avatar onPressPhoto={() => navigation.navigate(ScrennTypeEnum.Profile)} />
      <View style={[{}, tw`bg-gray-50`]}>
        <ProfileList />
      </View>
    </ScrollView>
  )
}
export default Ny
