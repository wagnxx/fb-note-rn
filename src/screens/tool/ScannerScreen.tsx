import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ToastAndroid,
  Platform,
  Modal,
  StatusBar,
  Image,
} from 'react-native'
import tw from 'twrnc'
import Icon from 'react-native-vector-icons/Feather'
import Clipboard from '@react-native-clipboard/clipboard'
import { XMarkIcon } from 'react-native-heroicons/outline'
import QRCodeScanner from './components/QRCodeScanner'
import { WebView } from 'react-native-webview'

/**
 * ✅ 添加 image 字段
 */
interface ScanRecord {
  code: string
  time: string
  image?: string // ← 新增
}

export default function ScannerScreen() {
  const [tab, setTab] = useState<'scan' | 'history'>('scan')
  const [isScanning, setIsScanning] = useState(false)
  const [history, setHistory] = useState<ScanRecord[]>([])
  const [detail, setDetail] = useState<ScanRecord | null>(null) // 点击历史显示详情

  /**
   * 扫码成功（带图片）
   */
  const handleDetected = (code: string, imagePath?: string) => {
    const newRecord: ScanRecord = {
      code,
      time: new Date().toISOString(),
      image: imagePath, // ← 保存图片
    }

    setHistory(prev => [newRecord, ...prev])
    setIsScanning(false)
    Alert.alert('扫码成功', code)
  }

  /**
   * 点击历史 item → 显示详情
   */
  const handleOpenDetail = (item: ScanRecord) => {
    setDetail(item)
  }

  const renderHistoryItem = ({ item }: { item: ScanRecord }) => {
    const handleCopy = () => {
      Clipboard.setString(item.code)
      if (Platform.OS === 'android') ToastAndroid.show('已复制到剪贴板', ToastAndroid.SHORT)
      else Alert.alert('已复制', item.code)
    }

    return (
      <TouchableOpacity
        style={tw`p-3 mb-2 bg-gray-100 rounded-xl`}
        onPress={() => handleOpenDetail(item)} // ← 打开详情
      >
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-gray-800 font-medium flex-1 mr-2`} numberOfLines={1}>
            {item.code}
          </Text>
          <TouchableOpacity onPress={handleCopy}>
            <Icon name="copy" size={18} color="#555" />
          </TouchableOpacity>
        </View>
        <Text style={tw`text-gray-500 text-sm mt-1`}>{new Date(item.time).toLocaleString()}</Text>
      </TouchableOpacity>
    )
  }

  const handleSwitchTab = (target: 'scan' | 'history') => {
    setTab(target)
    if (target === 'history') setIsScanning(false)
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar hidden={true} translucent={true} />

      {/* ---------------- TAB ---------------- */}
      <View style={tw`flex-row border-b border-gray-200`}>
        <TouchableOpacity
          onPress={() => handleSwitchTab('scan')}
          style={tw`flex-1 py-3 ${tab === 'scan' ? 'border-b-2 border-blue-500' : ''}`}
        >
          <Text
            style={tw`text-center text-base ${
              tab === 'scan' ? 'text-blue-600 font-semibold' : 'text-gray-600'
            }`}
          >
            扫码
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleSwitchTab('history')}
          style={tw`flex-1 py-3 ${tab === 'history' ? 'border-b-2 border-blue-500' : ''}`}
        >
          <Text
            style={tw`text-center text-base ${
              tab === 'history' ? 'text-blue-600 font-semibold' : 'text-gray-600'
            }`}
          >
            历史记录
          </Text>
        </TouchableOpacity>
      </View>

      {/* ---------------- 内容 ---------------- */}
      {tab === 'scan' ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <TouchableOpacity
            onPress={() => setIsScanning(true)}
            style={tw`mt-10 bg-blue-600 px-6 py-3 rounded-full`}
          >
            <Text style={tw`text-white text-base font-medium`}>开始扫码</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={tw`flex-1 p-4`}>
          {history.length === 0 ? (
            <Text style={tw`text-gray-500 text-center mt-10`}>暂无扫描记录</Text>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item, index) => `${item.code}-${index}`}
              renderItem={renderHistoryItem}
            />
          )}
        </View>
      )}

      {/* ---------------- 扫码全屏 ---------------- */}
      <Modal visible={isScanning} animationType="slide">
        <QRCodeScanner
          onDetected={handleDetected} // 带图片返回
          onClose={() => setIsScanning(false)}
        />

        <TouchableOpacity
          style={tw`absolute top-10 right-4 bg-black opacity-40 p-2 rounded-full`}
          onPress={() => setIsScanning(false)}
        >
          <XMarkIcon style={tw`text-white text-base font-medium`} />
        </TouchableOpacity>
      </Modal>

      {/* ---------------- 历史详情 Modal ---------------- */}
      <Modal visible={detail !== null} animationType="slide">
        {detail && (
          <View style={tw`flex-1`}>
            <TouchableOpacity
              style={tw`absolute top-10 right-4 z-50 bg-black opacity-40 p-2 rounded-full`}
              onPress={() => setDetail(null)}
            >
              <XMarkIcon style={tw`text-white text-base font-medium`} />
            </TouchableOpacity>

            {/* 图片 */}
            {detail.image ? (
              <Image
                source={{ uri: 'file://' + detail.image }}
                style={tw`w-full h-60 bg-black`}
                resizeMode="contain"
              />
            ) : (
              <View style={tw`w-full h-40 bg-gray-200 justify-center items-center`}>
                <Text style={tw`text-gray-500`}>无图片</Text>
              </View>
            )}

            {/* 内容 / 链接 */}
            <View style={tw`flex-1`}>
              {detail.code.startsWith('http') ? (
                <WebView source={{ uri: detail.code }} />
              ) : (
                <View style={tw`p-4`}>
                  <Text style={tw`text-lg font-medium mb-2`}>扫码内容：</Text>
                  <Text style={tw`text-gray-800`}>{detail.code}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </Modal>
    </View>
  )
}
