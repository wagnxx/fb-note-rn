import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import BarcodeScanner from '@/components/BarcodeScanner';
import tw from 'twrnc';

interface ScanRecord {
  code: string;
  time: string; // ISO 字符串
}

export default function ScannerScreen() {
  const [tab, setTab] = useState<'scan' | 'history'>('scan');
  const [history, setHistory] = useState<ScanRecord[]>([]);

  const handleDetected = (code: string) => {
    console.log('handleDetected code:', code);

    const newRecord: ScanRecord = {
      code,
      time: new Date().toISOString(),
    };

    setHistory((prev) => {
      // 去重，如果已有相同 code 就不添加
    //   const exists = prev.find((r) => r.code === code);
    //   if (exists) return prev;
      return [newRecord, ...prev]; // 最新在最上面
    });

    // Alert.alert('扫码成功', code);
  };

  const renderHistoryItem = ({ item }: { item: ScanRecord }) => (
    <View style={tw`p-3 mb-2 bg-gray-100 rounded-xl`}>
      <Text style={tw`text-gray-800 font-medium`}>{item.code}</Text>
      <Text style={tw`text-gray-500 text-sm mt-1`}>{new Date(item.time).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Tab 切换 */}
      <View style={tw`flex-row border-b border-gray-200`}>
        <TouchableOpacity
          onPress={() => setTab('scan')}
          style={tw`flex-1 py-3 ${tab === 'scan' ? 'border-b-2 border-blue-500' : ''}`}
        >
          <Text style={tw`text-center text-base ${tab === 'scan' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
            扫码
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTab('history')}
          style={tw`flex-1 py-3 ${tab === 'history' ? 'border-b-2 border-blue-500' : ''}`}
        >
          <Text style={tw`text-center text-base ${tab === 'history' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
            历史记录
          </Text>
        </TouchableOpacity>
      </View>

      {/* 内容区域 */}
      {tab === 'scan' ? (
        <BarcodeScanner onDetected={handleDetected} />
      ) : (
        <View style={tw`flex-1 p-4`}>
          {history.length === 0 ? (
            <Text style={tw`text-gray-500 text-center mt-10`}>暂无扫描记录</Text>
          ) : (
            <FlatList
              data={history.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())} // 最新在上
              keyExtractor={(item, index) => `${item.code}-${index}`}
              renderItem={renderHistoryItem}
            />
          )}
        </View>
      )}
    </View>
  );
}
