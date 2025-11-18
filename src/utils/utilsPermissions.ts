import { Platform } from 'react-native'
import { request, PERMISSIONS, PermissionStatus } from 'react-native-permissions'

export async function requestCameraPermission(): Promise<PermissionStatus> {
  if (Platform.OS === 'ios') return request(PERMISSIONS.IOS.CAMERA)
  return request(PERMISSIONS.ANDROID.CAMERA)
}

export async function requestPhotoPermission(): Promise<PermissionStatus> {
  if (Platform.OS === 'ios') return request(PERMISSIONS.IOS.PHOTO_LIBRARY)
  // Android 13+ uses READ_MEDIA_IMAGES; keep backward compatible
  return request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
}
