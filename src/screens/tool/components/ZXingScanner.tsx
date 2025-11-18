import { NativeModules, NativeEventEmitter, Button } from 'react-native'
import { useEffect } from 'react'

const { ZXingScannerModule } = NativeModules

export default function ScannerScreen() {
  useEffect(() => {
    const emitter = new NativeEventEmitter(ZXingScannerModule)
    const sub = emitter.addListener('onScannerResult', (result: string) => {
      console.log('扫描结果：', result)
      // TODO: 显示选择界面或存历史
    })

    return () => sub.remove()
  }, [])

  return (
    <Button
      title="启动扫码"
      onPress={() => {
        ZXingScannerModule.startScanner()
      }}
    />
  )
}
