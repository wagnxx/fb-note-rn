import { SafeAreaView } from 'react-native'
import React, { useContext, useState } from 'react'
import { ScreenFC, ScrennTypeEnum } from '@/types/screen'
import { AuthContext } from '@/context/auth-provider'
import ProfileList from './components/profile-list'
import Avatar from './components/avatar'
import Settings from './components/settings'
import { useTheme } from 'react-native-paper'

const Ny: ScreenFC<ScrennTypeEnum.My> = ({ navigation }) => {
  const { user } = useContext(AuthContext)
  const [showSettings, setShowSettings] = useState(false)

  const theme = useTheme()

  return (
    <SafeAreaView
      style={[{ backgroundColor: theme.colors.background, flex: 1 }]}
    >
      <Avatar
        onPressPhoto={() => navigation.navigate(ScrennTypeEnum.Profile)}
      />
      <ProfileList onSettingsDrawerOpen={() => setShowSettings(true)} />

      <Settings
        showSettings={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </SafeAreaView>
  )
}
export default Ny
