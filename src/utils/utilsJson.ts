import RNFS from 'react-native-fs'

export const loadJsonFromAssets = async (url: string) => {
  const assetPath = `${url}` // 构建 assets 下的路径
  try {
    const fileContent = await RNFS.readFileAssets(assetPath) // 读取 assets 文件
    const jsonData = JSON.parse(fileContent)
    return jsonData
  } catch (error) {
    console.error('Error loading JSON file from assets:', error)
    return null
  }
}
