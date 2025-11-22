import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler'
import tw from 'twrnc'
import { XMarkIcon } from 'react-native-heroicons/outline'

export enum SwipeDirection {
  left,
  right,
}

type PhotoPreviewProps = {
  imageUrl: string
  onClose: () => void
  onSwipe: (direction: SwipeDirection) => void // 新增的 onSwipe 回调
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  imageUrl,
  onClose,
  onSwipe,
}) => {
  const scale = useSharedValue(1)
  const lastScale = useSharedValue(1)
  const translateX = useSharedValue(0)

  const handlePinch = event => {
    if (event.nativeEvent.state === State.ACTIVE) {
      scale.value = lastScale.value * event.nativeEvent.scale
    } else if (event.nativeEvent.state === State.END) {
      lastScale.value = scale.value
    }
  }

  const handlePan = event => {
    if (event.nativeEvent.state === State.ACTIVE) {
      translateX.value = event.nativeEvent.translationX
    } else if (event.nativeEvent.state === State.END) {
      if (translateX.value < -50) {
        onSwipe(SwipeDirection.left) // 向左滑动
      } else if (translateX.value > 50) {
        onSwipe(SwipeDirection.right) // 向右滑动
      }
      translateX.value = withSpring(0)
    }
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(scale.value) },
        { translateX: translateX.value },
      ],
    }
  })

  return (
    <View style={tw`absolute inset-0 bg-black`}>
      <TouchableOpacity
        style={tw`absolute top-4 right-4 z-10`}
        onPress={onClose}
      >
        <XMarkIcon size={24} color={'#fff'} />
      </TouchableOpacity>
      <PanGestureHandler
        onGestureEvent={handlePan}
        onHandlerStateChange={handlePan}
      >
        <Animated.View
          style={[tw`flex-1 justify-center items-center`, animatedStyle]}
        >
          <PinchGestureHandler
            onGestureEvent={handlePinch}
            onHandlerStateChange={handlePinch}
          >
            <Animated.Image
              source={{ uri: imageUrl }}
              style={tw`w-full h-full`}
              resizeMode="contain"
            />
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    </View>
  )
}

export default PhotoPreview
