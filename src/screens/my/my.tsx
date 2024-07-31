import { View, ScrollView, SafeAreaView } from 'react-native'
import React, { useContext, useState } from 'react'
import { ScreenFC, ScrennTypeEnum } from '@/types/screen'
import { AuthContext } from '@/context/auth-provider'
import ProfileList, { Actions } from './components/profile-list'
import Avatar from './components/avatar'
import tw from 'twrnc'
import Settings from './components/settings'
import { developWarn } from '@/utils/utilsAlert'

const Ny: ScreenFC<ScrennTypeEnum.My> = ({ navigation }) => {
  const { user } = useContext(AuthContext)
  const [showSettings, setShowSettings] = useState(false)
  const doAction = (name: Actions) => {
    console.log('name', name)
    switch (name) {
      case Actions.settings:
        setShowSettings(true)
        break
      default:
        developWarn()
    }
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Avatar
          onPressPhoto={() => navigation.navigate(ScrennTypeEnum.Profile)}
        />
        <View style={[{}, tw`bg-gray-50`]}>
          <ProfileList doAction={doAction} />
        </View>
      </ScrollView>

      <Settings
        showSettings={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </SafeAreaView>
  )
}
export default Ny
