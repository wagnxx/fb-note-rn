import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Camera, useCameraDevice } from 'react-native-vision-camera'
import { useBarcodeScanner } from '@mgcrea/vision-camera-barcode-scanner'
import { runOnJS } from 'react-native-reanimated'
import type { Barcode } from '@mgcrea/vision-camera-barcode-scanner'

export default function BarcodeScannerScreen() {
  const device = useCameraDevice('back')

  const [barcodes, setBarcodes] = useState<Barcode[]>([])
  const [selected, setSelected] = useState<Barcode | null>(null)

  // 主线程处理扫描结果
  const handleBarcodes = (newBarcodes: Barcode[]) => {
    setBarcodes(newBarcodes)
    if (newBarcodes.length > 0 && !selected) {
      setSelected(newBarcodes[0])
    }
  }

  const { props: cameraProps } = useBarcodeScanner({
    fps: 5,
    barcodeTypes: ['qr', 'ean-13', 'code-128'],
    onBarcodeScanned: (newBarcodes: Barcode[]) => {
      'worklet'
      runOnJS(handleBarcodes)(newBarcodes)
    },
  })

  if (!device) return <Text style={styles.loading}>Loading Camera...</Text>

  return (
    <View style={{ flex: 1 }}>
      {/* Camera 预览 */}
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} {...cameraProps} />

      {/* 状态文字 */}
      <View style={styles.overlay}>
        {selected ? (
          <Text style={styles.text}>
            Selected ({selected.type}): {selected.value}
          </Text>
        ) : (
          <Text style={styles.text}>Scanning...</Text>
        )}
      </View>

      {/* 渲染条码框 */}
      {barcodes.map((code, idx) => {
        if (!code.boundingBox) return null
        const isSelected = code === selected
        const { origin, size } = code.boundingBox

        return (
          <TouchableOpacity
            key={idx}
            style={[
              styles.marker,
              {
                left: origin.x,
                top: origin.y,
                width: size.width,
                height: size.height,
                borderColor: isSelected ? 'white' : 'lime',
                borderWidth: isSelected ? 3 : 2,
              },
            ]}
            onPress={() => setSelected(code)}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
  },
  marker: {
    position: 'absolute',
    borderRadius: 4,
  },
  loading: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
})
