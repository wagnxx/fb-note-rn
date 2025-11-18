import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

interface QRCodeDetailRouteParams {
  qrData: string;
}

const QRCodeDetail: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { qrData } = route.params as QRCodeDetailRouteParams;

  // 检查是否是 URL
  const isURL = (text: string) => {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(text);
  };

  const handleOpenURL = async () => {
    if (isURL(qrData)) {
      try {
        const canOpen = await Linking.canOpenURL(qrData);
        if (canOpen) {
          await Linking.openURL(qrData);
        } else {
          Alert.alert('错误', '无法打开此链接');
        }
      } catch (error) {
        Alert.alert('错误', '打开链接时发生错误');
      }
    } else {
      Alert.alert('提示', '这不是一个有效的网址');
    }
  };

  const handleCopy = () => {
    // 这里可以实现复制到剪贴板的功能
    Alert.alert('已复制', '内容已复制到剪贴板');
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`p-4 border-b border-gray-200`}>
        <Text style={tw`text-xl font-bold text-center`}>二维码详情</Text>
      </View>
      
      <ScrollView style={tw`flex-1 p-6`}>
        <View style={tw`bg-gray-50 rounded-lg p-4 mb-6`}>
          <Text style={tw`text-sm text-gray-500 mb-2`}>扫描内容</Text>
          <Text style={tw`text-base text-gray-800`}>{qrData}</Text>
        </div>

        <View style={tw`space-y-4`}>
          {isURL(qrData) && (
            <TouchableOpacity
              style={tw`bg-blue-500 rounded-lg py-4 px-6`}
              onPress={handleOpenURL}
            >
              <Text style={tw`text-white text-center font-semibold text-lg`}>
                打开链接
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={tw`bg-gray-200 rounded-lg py-4 px-6`}
            onPress={handleCopy}
          >
            <Text style={tw`text-gray-800 text-center font-semibold text-lg`}>
              复制内容
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={tw`border border-gray-300 rounded-lg py-4 px-6`}
            onPress={() => navigation.goBack()}
          >
            <Text style={tw`text-gray-600 text-center font-semibold text-lg`}>
              返回扫描
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default QRCodeDetail;