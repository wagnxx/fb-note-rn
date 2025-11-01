// src/components/BarcodeScanner/index.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { Camera, useCameraDevices, useCodeScanner  } from 'react-native-vision-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import BarcodeScanning from '@react-native-ml-kit/barcode-scanning'
import tw from 'twrnc';
import { scanStaticImage } from '@/utils/utilsBarcode';

interface Props {
  onDetected?: (code: string) => void;
  onError?: (error: Error) => void;
  active?: boolean;
}

export default function BarcodeScanner({ onDetected, active = true, onError }: Props) {

  const devices = useCameraDevices();
  const device = devices.find((d) => d.position === 'back');

  const [hasPermission, setHasPermission] = useState(false);
  const [codes, setCodes] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);

  // 请求相机权限
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  /** 实时扫描逻辑 **/
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128', 'pdf-417', 'data-matrix'],
    onCodeScanned: (detectedCodes) => {
      if (detectedCodes.length > 0) {
        setCodes(detectedCodes);
      } else {
        setCodes([]);
      }
    },
  });

  /** 切换选中框 **/
  const toggleSelect = useCallback((value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }, []);

  /** 确认扫码 **/
  const handleConfirm = useCallback(() => {
    if (selected.length === 0) {
      Alert.alert('提示', '请先选择要扫码的二维码');
      return;
    }
    Alert.alert('扫码结果', selected.join('\n'));
    selected.forEach((v) => onDetected?.(v));
  }, [selected]);

  /** 从相册选择图片 **/
  const handlePickImage = useCallback(async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });

    if (!result.assets?.[0]?.uri) return;

    const uri = result.assets[0].uri;
    setImageUri(uri);

    scanStaticImage(uri)
    .then(value => {
      onDetected?.(value); 
    })
    .catch(err => {
      const error = err instanceof Error ? err : new Error(String(err));
      onError?.(error);
      Alert.alert(error.message)
    })


    
    

  }, []);

  if (!device)
    return <Text style={tw`text-white text-center mt-12`}>📷 正在初始化相机设备...</Text>;

  if (!hasPermission)
    return <Text style={tw`text-white text-center mt-12`}>🚫 没有相机权限，请前往系统设置开启</Text>;

  return (
    <View style={tw`flex-1 bg-black`}>
      {/* 摄像头预览 */}
      {!imageUri && (
        <Camera
          style={tw`absolute inset-0`}
          device={device}
          isActive={active}
          codeScanner={codeScanner}
        />
      )}

      {/* 静态图片预览 */}
      {imageUri && (
        <Image source={{ uri: imageUri }} style={tw`absolute inset-0`} resizeMode="contain" />
      )}

      {/* 提示文案 */}
      <View style={tw`absolute bottom-28 w-full items-center`}>
        <Text style={tw`text-white text-base mb-4`}>
          {imageUri ? '静态图片识别模式' : '将二维码放入框内扫描'}
        </Text>
      </View>

      {/* 绘制动态扫码框 */}
      {!imageUri &&
        codes.map((code, index) => {
          const { x, y, width, height } = code.bounds;
          const isSelected = selected.includes(code.value);
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => toggleSelect(code.value)}
              style={[
                styles.codeBox,
                {
                  left: x,
                  top: y,
                  width,
                  height,
                  borderColor: isSelected ? '#00FF00' : '#FFFFFF',
                },
              ]}
            >
              <Text
                style={[
                  styles.codeText,
                  isSelected ? styles.codeTextSelected : styles.codeTextNormal,
                ]}
              >
                {code.value?.slice(0, 12) || 'QR'}
              </Text>
            </TouchableOpacity>
          );
        })}

      {/* 底部操作按钮 */}
      <View style={tw`absolute bottom-10 w-full flex-row justify-between gap-4`}>
        {!imageUri && codes.length > 0 && (
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmText}>确认选择</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.albumButton} onPress={handlePickImage}>
          <Text style={styles.confirmText}>
            {imageUri ? '重新选择图片' : '从相册识别二维码'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}






const styles = StyleSheet.create({
  codeBox: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 8,
  },
  codeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  codeTextNormal: {
    color: '#FFFFFF',
  },
  codeTextSelected: {
    color: '#00FF00',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  albumButton: {
    backgroundColor: '#444',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
