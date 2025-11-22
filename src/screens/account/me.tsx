import { Alert, SafeAreaView, View } from 'react-native'
import { useState } from 'react'
import { ScreenFC, ScrennTypeEnum } from '@/types/screen'
import ProfileList from './components/profile-list'
import Avatar from './components/avatar'
import Settings from './components/settings'
import { useTheme } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { selectAuth } from '@/features/auth/authSlice'
import { Bars3Icon } from 'react-native-heroicons/outline'

const Me: ScreenFC<ScrennTypeEnum.Me> = ({ navigation }) => {
  const [showSettings, setShowSettings] = useState(false)
  const { user } = useSelector(selectAuth)
  const theme = useTheme()

  const handlePressAvatar = () => {
    if (!user) {
      Alert.alert('尚未登录', '请先登录', [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '去登录',
          onPress: () => navigation.navigate(ScrennTypeEnum.Login),
        },
      ])
      return
    }
    navigation.navigate(ScrennTypeEnum.Profile)
  }

  return (
    <SafeAreaView style={[{ backgroundColor: theme.colors.background, flex: 1 }]}>
      <Avatar onPressPhoto={handlePressAvatar} />

      {user && <ProfileList onSettingsDrawerOpen={() => setShowSettings(true)} />}
      <Settings showSettings={showSettings} onClose={() => setShowSettings(false)} />
      {/*  // setting button to open settings drawer */}
      <View
        style={{
          position: 'absolute',
          top: 8,
          right: 10,
          // height: 50,
          // width: 50,
          // backgroundColor: 'red',
        }}
      >
        <Bars3Icon color={'#444'} size={30} onPress={() => setShowSettings(true)} />
      </View>
    </SafeAreaView>
  )
}
export default Me
