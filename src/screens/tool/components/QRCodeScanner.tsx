import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, StyleSheet, Alert } from 'react-native'
import { Camera, Frame, useCameraDevice } from 'react-native-vision-camera'
import { Barcode, useBarcodeScanner } from '@mgcrea/vision-camera-barcode-scanner'
import { useRunOnJS } from 'react-native-worklets-core'
import RNFS from 'react-native-fs'
import { CameraHighlightsWithMeta } from './CameraHighlightsWithMeta'
import Clipboard from '@react-native-clipboard/clipboard'

type Props = {
  onDetected: (code: string, imagePath?: string) => void
  onClose?: () => void
}
const QRCodeScanner: React.FC<Props> = ({ onDetected, onClose }) => {
  const [isActive, setIsActive] = useState<boolean>(true)
  const [barcodes, setBarcodes] = useState<Barcode[]>([])
  const [scannrerKey, setscannrerKey] = useState<number>(0)
  const [photoCachePath, setPhotoCachePath] = useState<string | null>(null)

  const device = useCameraDevice('back')
  const camera = useRef<Camera>(null)

  useEffect(() => {
    // todo nothing
    return () => {
      if (photoCachePath) {
        RNFS.unlink(photoCachePath)
          .then(() => {
            console.log('删除缓存照片: ', photoCachePath)
          })
          .catch(err => {
            console.log('删除缓存照片失败: ', err)
          })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleBarcodeScanned = useRunOnJS(async (codes: Barcode[], frame: Frame) => {
    if (!camera?.current) {
      console.log('No camera ref!')
      return
    }
    if (codes.length === 0) return
    setBarcodes(codes)
    try {
      const photo = await camera.current.takePhoto()
      setPhotoCachePath(photo.path)
      console.log('takephoto success: ', photo.path)
      setIsActive(false)
    } catch (error) {
      console.log('takephoto error: ', error)
      if (scannrerKey < 4) {
        setscannrerKey(prev => prev + 1)
        console.log('reload camera')
      } else {
        Alert.alert('Error', '无法拍照，请重试', [
          {
            text: '确定',
            onPress: () => {
              onClose?.()
            },
          },
        ])
      }
      setPhotoCachePath(null)
    }
    // setIsActive(false)
  }, [])

  const { props: cameraProps, highlights } = useBarcodeScanner({
    fps: 5,
    barcodeTypes: ['qr', 'ean-13'], // optional
    scanMode: 'once',
    onBarcodeScanned: handleBarcodeScanned,
  })
  const highlightsWithMeta = useMemo(() => {
    if (highlights.length !== barcodes.length) return []

    const results = highlights.map((h, index) => ({
      size: h.size,
      origin: h.origin,
      meta: barcodes[index], // 整个 Barcode 传进去
    }))
    return results
  }, [barcodes, highlights])

  const handleSelectHighlight = async (meta: Barcode) => {
    if (!photoCachePath) {
      Alert.alert('提示', '没有可用的扫码图片，请重新扫描', [
        {
          text: '确定',
          onPress: () => {
            onClose?.()
          },
        },
      ])
      return
    }

    Alert.alert(`识别到条码: ${meta.value}`, '是否将此条码保存到历史记录？', [
      {
        text: '不用',
        style: 'cancel',
        onPress: () => {
          setPhotoCachePath(null)
        },
      },
      {
        text: '保存并复制',
        onPress: async () => {
          if (!photoCachePath) return

          const savedPath = await moveToHistory(photoCachePath)

          // 复制条码内容
          Clipboard.setString(meta.value || '')

          onDetected(meta.value!, savedPath)

          setPhotoCachePath(null)
        },
      },
    ])
  }

  if (!device) return <Text style={styles.loading}>Loading Camera...</Text>

  return (
    <View style={{ flex: 1 }}>
      <Camera
        key={scannrerKey}
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        {...cameraProps}
        photo={true}
        isActive={isActive}
      />

      <CameraHighlightsWithMeta<Barcode>
        highlights={highlightsWithMeta}
        color="green"
        onSelect={handleSelectHighlight}
      />

      {/* 状态文字 */}
      <View style={styles.overlay}>
        <Text style={styles.text}>Scanning...</Text>
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
