import { View, Animated, Dimensions } from 'react-native'
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import tw from 'twrnc'
const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const UnionPage = ({ guidePage, targetPage }, ref) => {
  const sidebarAnimation = useRef(new Animated.Value(screenWidth)).current

  const showSidebar = () => {
    Animated.timing(sidebarAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }
  const hideSidebar = () => {
    Animated.timing(sidebarAnimation, {
      toValue: screenWidth,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  useImperativeHandle(ref, () => ({
    show: showSidebar,
    hide: hideSidebar,
  }))

  return (
    <View style={[tw`flex-1 bg-green-500`]}>
      {guidePage}

      <Animated.View
        style={[
          tw`absolute`,
          { width: screenWidth, height: screenHeight },
          { transform: [{ translateX: sidebarAnimation }] },
        ]}
      >
        {targetPage}
      </Animated.View>
    </View>
  )
}

export default forwardRef(UnionPage)
