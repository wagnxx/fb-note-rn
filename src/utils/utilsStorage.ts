import AsyncStorage from '@react-native-async-storage/async-storage'

export const getItem = async (key: string, defaultValue) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : defaultValue ? defaultValue : null
  } catch (error) {
    console.error('Error reading data:', error)
  }
}
export const setItem = async (key: string, value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (error) {
    console.error('Error storing data:', error)
  }
}

export interface ICurrentFolder {
  id: string
  name: string
}
const CURRENT_FOLDER_KEY = 'current_folder_key'
export const saveCurrentFolderToStorage = (value: ICurrentFolder) => setItem(CURRENT_FOLDER_KEY, value)
export const getCurrentFolderFromStorage = defaultValue =>
  getItem(CURRENT_FOLDER_KEY, defaultValue) as Promise<ICurrentFolder>
