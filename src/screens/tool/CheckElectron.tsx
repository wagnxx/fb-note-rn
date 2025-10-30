import React, { useState } from 'react'
import { View, Text, Button, ActivityIndicator } from 'react-native'
import { NetworkInfo } from 'react-native-network-info'
import WebView from 'react-native-webview'
import tw from 'twrnc'

const LOCAL_PORT = 3520
const CHAT_PATH = '/chat' // 或根据实际情况调整

const Tool = () => {
  const [loading, setLoading] = useState(false)
  const [chatUrl, setChatUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const scanElectron = async () => {
    setLoading(true)
    setError(null)
    setChatUrl(null)

    try {
      const ip = await NetworkInfo.getIPV4Address()
      const url = `http://${ip}:${LOCAL_PORT}${CHAT_PATH}`

      // 简单检查接口或静态资源是否能访问
      const response = await fetch(url, { method: 'HEAD' })
      if (response.ok) {
        setChatUrl(url)
      } else {
        setError('服务未响应')
      }
    } catch (err) {
      setError('未检测到 Electron 服务')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={tw`flex-1`}>
      {loading && (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" />
          <Text style={tw`mt-4`}>正在扫描 Electron 服务...</Text>
        </View>
      )}

      {!loading && chatUrl && <WebView source={{ uri: chatUrl }} style={tw`flex-1`} />}

      {!loading && !chatUrl && (
        <View style={tw`flex-1 justify-center items-center`}>
          {error && <Text style={tw`text-red-500 mb-4`}>{error}</Text>}
          <Button title="扫描 Electron 服务" onPress={scanElectron} />
        </View>
      )}
    </View>
  )
}

export default Tool
