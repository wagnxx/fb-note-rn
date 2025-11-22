import { useState, useEffect, useMemo } from 'react'
import { View, StyleSheet, Button, Dimensions, Text } from 'react-native'
import Svg, { Polygon } from 'react-native-svg'
import {
  Camera,
  Code,
  useCameraDevice,
  useCameraFormat,
  useCodeScanner,
} from 'react-native-vision-camera'

export default function CameraScanner() {
  const [hasPermission, setHasPermission] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [scannedCode, setScannedCode] = useState<Code | null>(null)
  const [codes, setCodes] = useState<Code[]>([])

  // 1. 获取后置摄像头
  const device = useCameraDevice('back')

  // 2. 固定输出格式（注意设备支持性）
  const format = useCameraFormat(device, [
    { videoAspectRatio: 16 / 9 },
    { videoResolution: { width: 3048, height: 2160 } },
    { fps: 60 },
  ])

  // 3. 条码扫描回调
  const handleBarcodeScanned = (barcodes: Code[]) => {
    if (barcodes.length > 0) {
      setIsActive(false)
      setScannedCode(barcodes[0])
      setCodes(barcodes)
    }
  }

  // 4. useCodeScanner
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codesDetected, frame) => {
      handleBarcodeScanned(codesDetected)
    },
  })

  // 5. 请求摄像头权限
  useEffect(() => {
    Camera.requestCameraPermission().then(status => {
      setHasPermission(status === 'granted')
    })
  }, [])

  const isLoading = useMemo(() => {
    return !device || !format || !hasPermission
  }, [device, format, hasPermission])

  // Camera preview 尺寸
  const previewSize = {
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').width * 9) / 16,
  }

  if (isLoading) {
    return <Text style={styles.text}>Loading Camera...</Text>
  }

  // Scanner frame 尺寸
  const frameSize = { width: format!.videoWidth, height: format!.videoHeight }

  // 坐标映射
  const scaleX = previewSize.width / frameSize.width
  const scaleY = previewSize.height / frameSize.height

  return (
    <View style={styles.container}>
      <Camera
        style={[styles.camera, { width: previewSize.width, height: previewSize.height }]}
        device={device!}
        codeScanner={codeScanner}
        isActive={isActive}
      />

      {/* Barcode Overlay */}
      <Svg style={[StyleSheet.absoluteFill, { top: 0, left: 0 }]}>
        {codes.length > 0
          ? codes.map((code, i) => {
              const points = code.corners?.map(c => `${c.x * scaleX},${c.y * scaleY}`).join(' ')
              return points ? (
                <Polygon key={i} points={points} stroke="red" strokeWidth={2} fill="none" />
              ) : null
            })
          : null}
      </Svg>

      {scannedCode && <Text style={styles.text}>Scanned: {scannedCode.value || 'N/A'}</Text>}

      <Button
        title="Scan Again"
        onPress={() => {
          setIsActive(true)
          setCodes([])
          setScannedCode(null)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  camera: { backgroundColor: 'black' },
  text: { marginTop: 20, fontSize: 18, color: 'black' },
})
