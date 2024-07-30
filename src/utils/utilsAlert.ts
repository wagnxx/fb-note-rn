import { Alert } from 'react-native'

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
