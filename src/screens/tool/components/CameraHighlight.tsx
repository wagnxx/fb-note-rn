import { FC } from 'react'
import { TouchableOpacity, ViewStyle, StyleSheet } from 'react-native'

export interface CameraHighlightProps {
  size: { width: number; height: number }
  origin: { x: number; y: number }
  color?: string
  onPress?: () => void
}

export const CameraHighlight: FC<CameraHighlightProps> = ({
  size,
  origin,
  color = 'red',
  onPress,
}) => {
  const { width, height } = size
  const { x: left, y: top } = origin

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={[
        styles.highlight,
        {
          width,
          height,
          left,
          top,
          borderColor: color,
        } as ViewStyle,
      ]}
    />
  )
}

const styles = StyleSheet.create({
  highlight: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 4,
  },
})
