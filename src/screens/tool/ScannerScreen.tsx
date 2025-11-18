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
} from 'react-native'
import tw from 'twrnc'
import Icon from 'react-native-vector-icons/Feather'
import Clipboard from '@react-native-clipboard/clipboard'
import { XMarkIcon } from 'react-native-heroicons/outline'
import QRCodeScanner from './components/QRCodeScanner'
// 你的全屏扫码组件

interface ScanRecord {
  code: string
  time: string // ISO 字符串
}

export default function ScannerScreen() {
  const [tab, setTab] = useState<'scan' | 'history'>('scan')
  const [isScanning, setIsScanning] = useState(false) // 控制 Modal 显示
  const [history, setHistory] = useState<ScanRecord[]>([])

  const handleDetected = (code: string) => {
    const newRecord: ScanRecord = {
      code,
      time: new Date().toISOString(),
    }
    setHistory(prev => [newRecord, ...prev])
    setIsScanning(false) // 扫到后自动关闭全屏扫码
    Alert.alert('扫码成功', code)
  }

  const renderHistoryItem = ({ item }: { item: ScanRecord }) => {
    const handleCopy = () => {
      Clipboard.setString(item.code)
      if (Platform.OS === 'android') {
        ToastAndroid.show('已复制到剪贴板', ToastAndroid.SHORT)
      } else {
        Alert.alert('已复制', item.code)
      }
    }
    return (
      <View style={tw`p-3 mb-2 bg-gray-100 rounded-xl`}>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-gray-800 font-medium flex-1 mr-2`}>{item.code}</Text>
          <TouchableOpacity onPress={handleCopy}>
            <Icon name="copy" size={18} color="#555" />
          </TouchableOpacity>
        </View>
        <Text style={tw`text-gray-500 text-sm mt-1`}>{new Date(item.time).toLocaleString()}</Text>
      </View>
    )
  }

  const handleSwitchTab = (target: 'scan' | 'history') => {
    setTab(target)
    if (target === 'history') setIsScanning(false)
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar hidden={true} translucent={true} />
      {/* 顶部 Tab */}
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

      {/* 内容 */}
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
              data={history.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())}
              keyExtractor={(item, index) => `${item.code}-${index}`}
              renderItem={renderHistoryItem}
            />
          )}
        </View>
      )}

      {/* 全屏扫码弹框 */}
      <Modal visible={isScanning} animationType="slide" transparent={false}>
        <QRCodeScanner
        // onDetected={handleDetected} // 扫到二维码回调
        // onClose={() => setIsScanning(false)} // 关闭弹框
        />
        {/* <BarcodeScanner
          onDetected={handleDetected}
          active={isScanning}
          onError={() => setIsScanning(false)}
        /> */}
        <TouchableOpacity
          style={tw`absolute top-10 right-4 bg-black opacity-40 p-2 rounded-full`}
          onPress={() => setIsScanning(false)}
        >
          <XMarkIcon style={tw`text-white text-base font-medium`} />
        </TouchableOpacity>
      </Modal>
    </View>
  )
}
