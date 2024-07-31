import { Alert } from 'react-native'
import Toast from 'react-native-toast-message'

type MessageConfirmProp = {
  title?: string
  message?: string
  cancelText?: string
  okText?: string
}
export const messageConfirm = ({
  title = 'Warning',
  message = '',
  cancelText = 'Cancel',
  okText = 'Confirm',
}: MessageConfirmProp) => {
  return new Promise((resolve, reject) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: cancelText,
          style: 'cancel',
          onPress: reject,
        },
        {
          text: okText,
          onPress: resolve,
        },
      ],
      { cancelable: false },
    )
  })
}

export const developWarn = () => {
  const text = 'This feature is under development.'

  Toast.show({
    type: 'info',
    position: 'top',
    text1: text,
    visibilityTime: 3000, // 显示时间
  })
}
