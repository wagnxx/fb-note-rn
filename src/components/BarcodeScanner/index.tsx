// src/components/BarcodeScanner/index.tsx
import { useEffect, useState, useCallback, useRef } from 'react'
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import {
  Camera,
  CodeScannerFrame,
  useCameraDevices,
  useCodeScanner,
} from 'react-native-vision-camera'
import { launchImageLibrary } from 'react-native-image-picker'
import tw from 'twrnc'
import DebugPhotoOverlay from './DebugPhotoOverlay'
const Canvas = require('react-native-canvas').default
const CanvasImage = require('react-native-canvas').Image

interface Props {
  onDetected?: (code: string) => void
  onError?: (error: Error) => void
  active?: boolean
}

const mockCodes = [
  {
    value: '充电器二维码1',
    frame: { height: 44, width: 45, x: 147, y: 201 },
  },
]

export default function BarcodeScanner({ onDetected, onError, active = true }: Props) {
  const devices = useCameraDevices()
  const device = devices.find(d => d.position === 'back')
  const [photoSize, setPhotoSize] = useState<{ width: number; height: number } | undefined>()
  const [codeScannerFrame, setCodeScannerFrame] = useState<CodeScannerFrame | undefined>()
  const cameraRef = useRef<Camera>(null)

  const [hasPermission, setHasPermission] = useState(false)
  const [codes, setCodes] = useState<any[]>([])
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(active)
  const isCapturing = useRef(false)

  // 请求相机权限
  useEffect(() => {
    ;(async () => {
      const status = await Camera.requestCameraPermission()
      setHasPermission(status === 'granted')
    })()
  }, [])

  /** 实时扫码逻辑 **/

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128', 'pdf-417', 'data-matrix'],
    onCodeScanned: async (detectedCodes, codeScannerFrame) => {
      if (isCapturing.current) return
      isCapturing.current = true

      if (detectedCodes.length === 0) return

      console.log('detectedCodes: ', detectedCodes)
      console.log('codeScannerFrame: ', codeScannerFrame)
      setCodeScannerFrame(codeScannerFrame)
      try {
        const photo = await cameraRef.current?.takePhoto()
        if (photo?.path) {
          const { path, width, height } = photo
          const photoUri = 'file://' + path
          setImageUri(photoUri)
          setCodes(detectedCodes)
          // debugger
          setPhotoSize({ width: photo.width, height: photo.height })

          // -------- 绘制二维码框并保存 ----------
          //   const base64 = await RNFS.readFile(path, 'base64');
          //   const base64Uri = `data:image/jpeg;base64,${base64}`;

          //   const canvas = new Canvas(width, height);
          //   const ctx = canvas.getContext('2d');
          //   const img = new CanvasImage(canvas);

          // console.log('start strokeRect: =============================================' );
          // await new Promise((resolve, reject) => {
          //   img.addEventListener('load', resolve);
          //   img.addEventListener('error', reject);
          // });

          // ctx.drawImage(img, 0, 0, width, height);
          // ctx.strokeStyle = '#00FF00';
          // ctx.lineWidth = 10;

          // for (const code of detectedCodes) {
          //   if (!code.frame) continue;
          //   const mapped = mapFrameToPhoto(code.frame, codeScannerFrame, { width, height }, 90);
          //   ctx.strokeRect(mapped.x, mapped.y, mapped.width, mapped.height);
          // }

          // const dataUrl = await canvas.toDataURL('image/jpeg');
          // const markedBase64 = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
          // const markedPath = `${RNFS.CachesDirectoryPath}/marked_${Date.now()}.jpg`;
          // await RNFS.writeFile(markedPath, markedBase64, 'base64');

          // await CameraRoll.save(`file://${markedPath}`, { type: 'photo' });
          // console.log('✅ 已保存标记图片:', markedPath);
          // Alert.alert('已保存', '标记后的图片已保存到相册');
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        Alert.alert('截图失败', error.message)
        onError?.(error)
      } finally {
        isCapturing.current = false
        setIsCameraActive(false)
      }
      // 单码直接上报
      // const value = detectedCodes[0].value;
      // if (value) onDetected?.(value);
    },
  })

  /** 从相册选择图片 **/
  const handlePickImage = useCallback(async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' })
    const uri = result.assets?.[0]?.uri
    if (!uri) return

    setImageUri(uri)
    setCodes(mockCodes)
    // try {
    //   const value = await scanStaticImage(uri);
    //   onDetected?.(value);
    // } catch (err) {
    //   const error = err instanceof Error ? err : new Error(String(err));
    //   Alert.alert('识别失败', error.message);
    //   onError?.(error);
    // }
  }, [])

  if (!device) return <Text style={tw`text-white text-center mt-12`}>📷 正在初始化相机设备...</Text>

  if (!hasPermission)
    return <Text style={tw`text-white text-center mt-12`}>🚫 没有相机权限，请前往系统设置开启</Text>

  return (
    <View style={tw`flex-1 bg-black`}>
      {/* 相机模式 */}
      {!imageUri && (
        <Camera
          ref={cameraRef}
          style={tw`absolute inset-0`}
          device={device}
          isActive={isCameraActive}
          codeScanner={codeScanner}
          photo={true}
        />
      )}

      {/* 静态图片识别模式 */}
      {imageUri && photoSize && (
        // <StaticImageScanner
        //   imageUri={imageUri}
        //   codes={codes}
        //   photoSize={photoSize}
        //   codeScannerFrame={codeScannerFrame}
        //   onSelect={(value) => {
        //     onDetected?.(value);
        //   }}
        // />
        <DebugPhotoOverlay
          imageUri={imageUri}
          photoSize={photoSize}
          codes={codes}
          scannerFrame={codeScannerFrame}
        />
      )}

      {/* 底部操作按钮 */}
      <View style={tw`absolute bottom-20 w-full flex-row justify-center gap-4`}>
        {imageUri ? (
          <TouchableOpacity
            style={styles.albumButton}
            onPress={() => {
              setImageUri(null)
              setCodes([])
              setIsCameraActive(true)
            }}
          >
            <Text style={styles.confirmText}>重新扫描</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.albumButton} onPress={handlePickImage}>
            <Text style={styles.confirmText}>从相册识别二维码</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
})

export interface Frame {
  x: number
  y: number
  width: number
  height: number
}

export interface PhotoSize {
  width: number
  height: number
}

export interface ScannerFrame {
  width: number
  height: number
}

/**
 * 将二维码 frame 从 scannerFrame 坐标映射到 photo 尺寸
 * @param codeFrame 扫描器返回的 code.frame
 * @param scannerFrame 扫描器可视区域尺寸
 * @param photoSize 拍照后的原图尺寸
 * @param options.rotationDegrees 相机旋转角度（0 或 90）
 * @param options.mirrored 是否前置摄像头镜像
 * @returns 对应 photo 上的 frame
 */
export function mapFrameToPhoto(
  codeFrame: Frame,
  scannerFrame: ScannerFrame,
  photoSize: PhotoSize,
  options?: { rotationDegrees?: 0 | 90; mirrored?: boolean },
): Frame {
  const { rotationDegrees = 0, mirrored = false } = options || {}

  // scanner -> photo 缩放比例
  const scaleX = photoSize.width / scannerFrame.width
  const scaleY = photoSize.height / scannerFrame.height

  let mapped: Frame = {
    x: codeFrame.x * scaleX,
    y: codeFrame.y * scaleY,
    width: codeFrame.width * scaleX,
    height: codeFrame.height * scaleY,
  }

  // 前置摄像头镜像
  if (mirrored) {
    mapped.x = photoSize.width - (mapped.x + mapped.width)
  }

  // 旋转处理
  if (rotationDegrees === 90) {
    mapped = {
      x: photoSize.width - (mapped.y + mapped.height),
      y: mapped.x,
      width: mapped.height,
      height: mapped.width,
    }
  }

  return mapped
}
