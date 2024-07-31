import { ScrollView, SafeAreaView } from 'react-native'
import React, { useContext, useState } from 'react'
import { ScreenFC, ScrennTypeEnum } from '@/types/screen'
import { AuthContext } from '@/context/auth-provider'
import ProfileList from './components/profile-list'
import Avatar from './components/avatar'
import Settings from './components/settings'

const Ny: ScreenFC<ScrennTypeEnum.My> = ({ navigation }) => {
  const { user } = useContext(AuthContext)
  const [showSettings, setShowSettings] = useState(false)

  return (
    <SafeAreaView>
      <ScrollView>
        <Avatar
          onPressPhoto={() => navigation.navigate(ScrennTypeEnum.Profile)}
        />

        <ProfileList onSettingsDrawerOpen={() => setShowSettings(true)} />
      </ScrollView>

      <Settings
        showSettings={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </SafeAreaView>
  )
}
export default Ny
