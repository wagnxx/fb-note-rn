import React, { useMemo, useRef, useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { Camera, Code, Frame, useCameraDevice } from 'react-native-vision-camera'
import { Barcode, useBarcodeScanner } from '@mgcrea/vision-camera-barcode-scanner'
import { useRunOnJS } from 'react-native-worklets-core'
import { CameraHighlights } from './CameraHighlights'
import RNFS from 'react-native-fs'
import { Image } from 'react-native'

type Props = {
  // onDetected: (code: string, imagePath?: string) : void: (code: string, imagePath?: string) : void
  onDetected: (code: string, imagePath?: string) => void
}
const QRCodeScanner: React.FC<Props> = ({ onDetected }) => {
  const [isActive, setIsActive] = useState<boolean>(true)
  const [selected, setSelected] = useState<Code | null>(null)
  const [barcodes, setBarcodes] = useState<Barcode[]>([])
  const [photoCachePath, setPhotoCachePath] = useState<string | null>(null)

  const device = useCameraDevice('back')
  const camera = useRef<Camera>(null)
  const scannrerRef = useRef<boolean>(false)

  const handleBarcodeScanned = useRunOnJS(async (codes: Barcode[], frame: Frame) => {
    if (scannrerRef.current) return
    scannrerRef.current = true

    setBarcodes(codes)
    if (!codes.length || !camera?.current) return
    try {
      const photo = await camera.current.takePhoto()
      setPhotoCachePath(photo.path)
      console.log('takephoto success: ', photo.path)
    } catch (error) {
      console.error('takephoto error: ', error)
      setPhotoCachePath(null)
    }
    setIsActive(false)
  }, [])

  const { props: cameraProps, highlights } = useBarcodeScanner({
    fps: 5,
    barcodeTypes: ['qr', 'ean-13'], // optional
    onBarcodeScanned: handleBarcodeScanned,
  })

  const highlightsWithMeta = useMemo(() => {
    const result = (highlights || []).map((h, index) => ({
      key: h.key,
      size: h.size,
      origin: h.origin,
      meta: barcodes[index],
    }))
    return result
  }, [highlights])

  const handleSelectHighlight = async (meta: Barcode) => {
    Alert.alert(`你点击条码: ${meta.value}`, 'want to take photo?', [
      {
        text: '取消',
        style: 'cancel',
        onPress: () => {
          setPhotoCachePath(null)
        },
      },
      {
        text: '拍照',
        onPress: async () => {
          if (!photoCachePath) return
          const savedPath = await moveToHistory(photoCachePath)
          onDetected(meta.value!, savedPath)
          setPhotoCachePath(null)
        },
      },
    ])
  }

  if (!device) return <Text style={styles.loading}>Loading Camera...</Text>

  return (
    <View style={{ flex: 1 }}>
      {/* Camera 预览 */}
      {isActive ? (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          {...cameraProps}
          photo={true}
          isActive={true}
        />
      ) : photoCachePath ? (
        <Image
          source={{ uri: 'file://' + photoCachePath }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      ) : (
        <Text>No Photo</Text>
      )}
      {
        // 条码高亮显示组件
        // highlightsWithMeta.length > 0 && (
        <CameraHighlights<Barcode>
          highlights={highlightsWithMeta}
          color="green"
          onSelect={handleSelectHighlight}
        />
      }
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
  highlight: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 2,
    zIndex: 9999,
  },
})

const moveToHistory = async (tmpPath: string) => {
  const destPath = RNFS.DocumentDirectoryPath + `/history-${Date.now()}.jpg`
  await RNFS.copyFile(tmpPath, destPath)
  return destPath
}

export default QRCodeScanner
