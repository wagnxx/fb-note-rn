// @types/react-native-image-pan-zoom.d.ts
declare module 'react-native-image-pan-zoom' {
  import { ComponentType } from 'react'

  // 定义 ImageZoomProps 类型
  export interface ImageZoomProps {
    cropWidth: number // 裁剪区域的宽度
    cropHeight: number // 裁剪区域的高度
    imageWidth: number // 图片的宽度
    imageHeight: number // 图片的高度
    minScale?: number // 最小缩放比例
    maxScale?: number // 最大缩放比例
    enableCenterFocus?: boolean // 是否启用居中缩放
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMove?: (e: any) => void // 移动时的回调
    children?: ReactNode // 允许子元素
  }

  // 定义 ImageZoom 组件
  const ImageZoom: ComponentType<ImageZoomProps>

  export default ImageZoom
}
