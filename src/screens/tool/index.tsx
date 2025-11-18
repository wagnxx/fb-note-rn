import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Feather from 'react-native-vector-icons/Feather';
import tw from 'twrnc'
import { StatusBar } from 'react-native';


type ToolItem = {
  key: string;
  title: string;
  screen: string;
};

const TOOL_LIST: ToolItem[] = [
  { key: 'check', title: 'Check Electron', screen: 'CheckElectron' },
  { key: 'scanner', title: '扫一扫', screen: 'Scanner' },
];

export default function ToolIndex() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handlePress = (screen: string) => {
    navigation.navigate(screen as never);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} translucent={true} />
      {/* 顶部标题栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <Feather name="arrow-left" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>工具中心</Text>
      </View>

      {/* 工具列表 */}
 
      <FlatList
        data={TOOL_LIST}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item.screen)}
            style={styles.item}
          >
            <Text style={styles.itemText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        horizontal={true}
      />
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20, 
  },
  item: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    alignSelf: 'flex-start',
    marginRight: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
});

// ScannerScreen
              {/* <BarcodeScanner onDetected={handleDetected} active={isScanning}  onError={() => setIsScanning(false)}/> */}