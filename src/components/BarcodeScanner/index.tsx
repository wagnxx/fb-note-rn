// src/components/BarcodeScanner/index.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { runOnJS } from 'react-native-reanimated';

interface Props {
  onDetected?: (code: string) => void;
  active?: boolean;
}

export default function BarcodeScanner({ onDetected, active = true }: Props) {
  const devices = useCameraDevices();
  const device = devices.find(d => d.position === 'back')

  const [hasPermission, setHasPermission] = useState(false);

  // 请求相机权限
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Frame processor 模拟扫码逻辑（示例，实际需接 MLKit 识别逻辑）
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    // 如果你有 native frame 识别逻辑，可以在这里调用
    // runOnJS(onDetected)('mock-code-123'); // 测试触发
  }, []);

  const handleTestScan = useCallback(() => {
    Alert.alert('扫描结果', 'https://example.com');
    onDetected?.('https://example.com');
  }, []);

  if (!device) {
    return <Text style={styles.text}>📷 正在初始化相机设备...</Text>;
  }

  if (!hasPermission) {
    return <Text style={styles.text}>🚫 没有相机权限，请前往系统设置开启</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={active}
        frameProcessor={frameProcessor}
        // frameProcessorFps={5}
      />
      <View style={styles.overlay}>
        <Text style={styles.tip}>将二维码放入框内扫描</Text>
        {/* 模拟扫码按钮 */}
        <TouchableOpacity onPress={handleTestScan} style={styles.mockButton}>
          <Text style={{ color: '#fff' }}>测试扫描</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  tip: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
  },
  mockButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});
