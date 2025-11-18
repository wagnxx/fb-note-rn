import { useEffect, useRef, useState } from 'react'
import {
  NativeModules,
  NativeEventEmitter,
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native'

const { QRCodeScannerModule } = NativeModules

interface Barcode {
  value: string
  frame: { x: number; y: number; width: number; height: number }
  corners: { x: number; y: number }[]
}

interface QRCodeScannerProps {
  onDetected: (barcodes: Barcode[]) => void
  style?: StyleProp<ViewStyle>
}

export default function QRCodeScannerNative({ onDetected, style }: QRCodeScannerProps) {
  const [barcodes, setBarcodes] = useState<Barcode[]>([])
  const eventEmitter = useRef(new NativeEventEmitter(QRCodeScannerModule)).current

  useEffect(() => {
    QRCodeScannerModule.startCamera()

    const sub = eventEmitter.addListener('onBarcodesDetected', (data: Barcode[]) => {
      setBarcodes(data)
      onDetected(data)
    })

    return () => {
      sub.remove()
      QRCodeScannerModule.stopCamera()
    }
  }, [eventEmitter, onDetected])

  return <View style={[styles.container, style]} />
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
})
