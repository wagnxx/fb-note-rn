import { Point, Size } from '@mgcrea/vision-camera-barcode-scanner'
import { FC } from 'react'
import { StyleSheet, View } from 'react-native'
import { CameraHighlight } from './CameraHighlight'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CameraHighlightProps<T = any> = {
  size: Size
  origin: Point
  color?: string
  meta?: T
}
export const CameraHighlightsWithMeta = <T,>({
  highlights,
  color = 'red',
  onSelect,
}: {
  highlights: CameraHighlightProps<T>[]
  color?: string
  onSelect?: (meta: T) => void // 点击回调
}) => {
  return (
    <>
      {highlights.map((highlight, index) => (
        <CameraHighlight
          key={index}
          size={highlight.size}
          origin={highlight.origin}
          color={highlight.color || color}
          onPress={
            () => onSelect?.(highlight.meta as T)
            // Alert.alert(highlight.meta ? JSON.stringify(highlight.meta) : `Highlight #${index + 1}`)
          }
        />
      ))}
    </>
  )
}

export const CameraHighlight2: FC<CameraHighlightProps> = ({ size, origin, color }) => {
  const { x: left, y: top } = origin
  const { width, height } = size
  return <View style={[styles.highlight, { width, height, top, left, borderColor: color }]} />
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
