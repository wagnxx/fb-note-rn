import { Dimensions, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import { Drawer } from 'react-native-paper'
import tw from 'twrnc'
import { messageConfirm } from '@/utils/utilsAlert'
import { logoutUser } from '@/firebase/auth'
import Toast from 'react-native-toast-message'
import { StyleSheet } from 'react-native'

const { height, width } = Dimensions.get('window')

type SettingsProps = {
  onClose: () => void
  showSettings: boolean
}

export default function Settings({
  onClose,
  showSettings = false,
}: SettingsProps) {
  const logout = () => {
    messageConfirm({
      message: 'Are you sure to logout?',
    })
      .then(() => {
        console.log('sure')
        logoutUser().then(res => {
          if (res) {
            Toast.show({
              type: 'success',
              text1: 'Logout success',
              visibilityTime: 3000,
            })
          } else {
            Toast.show({
              type: 'error',
              text1: 'Logout failed',
              visibilityTime: 3000,
            })
          }
        })
      })
      .catch(() => {
        onClose()
      })
  }

  return (
    <>
      {showSettings && (
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
      )}
      <Drawer.Section
        showDivider={false}
        style={[
          styles.drawerContainer,
          showSettings && styles.drawerOpen,
          tw`bg-gray-100`,
        ]}
      >
        <Drawer.Item label=" Logout" onPress={logout} />
      </Drawer.Section>
    </>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    // left: 0,
    top: 0,
    right: 0,
    // bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: height,
    width: width,
    zIndex: 1,
  },
  drawerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: -width, // 初始时隐藏 Drawer
    width: width * 0.65,
    height: height,
    backgroundColor: 'white',
    padding: 20,
    zIndex: 10,
  },
  drawerOpen: {
    right: 0, // Drawer 打开时的样式
  },
})
