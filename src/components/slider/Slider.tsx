import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
// import Slider from 'react-native-slider'
import Slider from '@react-native-community/slider'

interface SimpleSliderProps {
  value: number
  onValueChange: (value: number) => void
  minimumValue?: number
  maximumValue?: number
  step?: number
  showValueLabel?: boolean // 是否显示当前值标签
  vertical?: boolean // 是否竖向显示
  trackHeight?: number // 轨道高度
  thumbSize?: number // 滑块大小
  thumbColor?: string // 滑块颜色
  labelRender?: (value: number) => React.ReactNode

  rWidth?: number // rect width
  rHeight?: number // rect height
}

const SimpleSlider: React.FC<SimpleSliderProps> = ({
  value,
  onValueChange,
  minimumValue = 1,
  maximumValue = 100,
  step = 1,
  showValueLabel = true,
  vertical = true, // 默认竖向显示
  trackHeight = 100, // 轨道高度
  thumbSize = 100, // 滑块大小
  thumbColor = '#4F69A7', // 滑块颜色
  labelRender,
  rWidth = 100,
  rHeight = 40,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          // position: 'absolute',
          // left: '-50%',
          // bottom: 0,
        },
        vertical
          ? {
              width: rHeight,
              height: rWidth,
              // flexDirection: 'column',
            }
          : {
              width: rWidth,
              height: rHeight,
              flexDirection: 'row',
              alignItems: 'center',
            },
      ]}
    >
      {/* Vertical Slider */}
      <Slider
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        minimumTrackTintColor="#4F69A7"
        maximumTrackTintColor="#CCCCCC"
        thumbTintColor={thumbColor}
        style={[
          styles.slider,
          {
            width: rWidth,
            height: rHeight,
          },
          vertical
            ? {
                transform: [
                  { translateY: -(rHeight - rWidth) / 2 },
                  { translateX: (rHeight - rWidth) / 2 },
                  { rotate: '-90deg' },
                ],
              }
            : {},
        ]}
      />

      {/* Current Value */}
      {showValueLabel && (
        <View style={[{ position: 'absolute', top: vertical ? rWidth : rHeight }]}>
          {labelRender ? (
            labelRender(value)
          ) : (
            <Text style={styles.valueLabel}>{`Value: ${value}`}</Text>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},

  slider: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    // backgroundColor: 'red',
  },

  valueLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
})

export default SimpleSlider
