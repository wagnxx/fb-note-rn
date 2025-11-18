import React, { useState } from 'react';
import {
  Alert,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  LayoutChangeEvent,
  Text,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import tw from 'twrnc';
import { mapCodeToView } from '@/utils/utilsBarcode';

export interface StaticCode {
  value: string;
  frame: { x: number; y: number; width: number; height: number };
}

interface Props {
  imageUri: string;
  codes: StaticCode[];
  onSelect?: (value: string) => void;
  /** 图片实际像素大小（拍照或静态图原始尺寸） */
  photoSize?: { width: number; height: number };
  codeScannerFrame?: { width: number; height: number };
}

export default function StaticImageScanner({
  imageUri,
  codes,
  onSelect,
  photoSize = { width: 1980, height: 1440 },
  codeScannerFrame
}: Props) {
  const [viewSize, setViewSize] = useState({ width: 0, height: 0 });

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setViewSize({ width, height });
  };

  // 坐标映射：photo -> container
  const mapFrameToContainer = (frame: StaticCode['frame']) => {
    if (!viewSize.width || !viewSize.height || !codeScannerFrame) return frame;
    
    const mapped = mapCodeToView(
     frame,
      codeScannerFrame, // 原始回调里的frame
      photoSize,
      viewSize,
      {
        resizeMode: 'contain',
        rotationDegrees: 0, // 加上这个
        mirrored: false,
        debug: false,
      }
    );
    

  
    return mapped;
  };
  

  // 保存图片 + 打印调试数据
  const handleTestSave = async () => {
    try {
        const ok = await requestStoragePermission();
        if (!ok) {
          Alert.alert('没有权限', '请手动授予存储/相册权限');
          return;
        }

      const savedUri = await CameraRoll.saveAsset(imageUri, { type: 'photo' });
 
      console.log('✅ 保存到相册成功:', savedUri);
      console.log('🧩 测试数据：', { codes, photoSize, imageUri, codeScannerFrame });
      Alert.alert('✅ 成功', '图片已保存到相册，请查看控制台日志。');
    } catch (error) {
      console.error('❌ 保存失败:', error);
      Alert.alert('保存失败', String(error));
    }
  };

  return (
    <View style={tw`flex-1`} onLayout={handleLayout}>
      {/* 图片预览 */}
      <Image
        source={{ uri: imageUri }}
        style={tw`absolute inset-0`}
        resizeMode="contain"
        // resizeMode="cover"
      />

      {/* 绘制二维码标记框 */}
      {viewSize.width > 0 &&
        codes.map((code, index) => {
          const mapped = mapFrameToContainer(code.frame);
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              style={[
                styles.codeBox,
                {
                  left: mapped.x,
                  top: mapped.y,
                  width: mapped.width,
                  height: mapped.height,
                },
              ]}
              onPress={() => onSelect?.(code.value)}
            >
              <View style={styles.centerDot} />
            </TouchableOpacity>
          );
        })}

      {/* 测试按钮 */}
      <View style={tw`absolute bottom-6 left-0 right-0 items-center`}>
        <TouchableOpacity onPress={handleTestSave} activeOpacity={0.8} style={styles.testButton}>
          <Text style={styles.testButtonText}>🧪 保存测试数据</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  codeBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#00FF00',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#00FF00',
    shadowColor: '#00FF00',
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  testButton: {
    backgroundColor: '#00CC66',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  testButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});




async function requestStoragePermission() {
  if (Platform.OS !== 'android') return true;

  if (Platform.Version >= 33) {
    // Android 13+
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      {
        title: '访问图片权限',
        message: '应用需要访问您的相册以保存测试图片',
        buttonPositive: '确定',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else {
    // Android 10及以下
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: '存储权限',
        message: '应用需要访问存储空间以保存图片',
        buttonPositive: '确定',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
}

