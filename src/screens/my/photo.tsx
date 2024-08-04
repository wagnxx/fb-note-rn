import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native'
import React, { useRef, useState } from 'react'
import tw from 'twrnc'
import { ChevronRightIcon, TrashIcon } from 'react-native-heroicons/outline'
import { Divider, useTheme } from 'react-native-paper'
import PhotoList from './components/photo-list'
import PhotoRemovedList from './components/photo-removed-list'

const { width, height } = Dimensions.get('window')

enum SiderScreenType {
  deleted,
  normal,
}
export default function PhotoScreen() {
  const sidebarAnim = useRef(new Animated.Value(width)).current

  const theme = useTheme()
  const [showSiderScreen, setShowSiderScreen] = useState(false)
  const [siderScreenTag, setSiderScreenTag] = useState<SiderScreenType>(
    SiderScreenType.normal,
  )

  const startAnimated = () => {
    Animated.timing(sidebarAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const openRecentDeleted = () => {
    setShowSiderScreen(true)
    setSiderScreenTag(SiderScreenType.deleted)
    startAnimated()
  }
  const openPhotoList = () => {
    setShowSiderScreen(true)
    setSiderScreenTag(SiderScreenType.normal)
    startAnimated()
  }

  const onCloseSiderScreen = () => {
    Animated.timing(sidebarAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowSiderScreen(false)
    })
  }

  return (
    <View
      style={[tw`flex-1 p-2`, { backgroundColor: theme.colors.background }]}
    >
      <Animated.View
        style={[
          styles.siderScreen,
          { backgroundColor: theme.colors.background },
          { transform: [{ translateX: sidebarAnim }] },
        ]}
      >
        {showSiderScreen && siderScreenTag === SiderScreenType.normal && (
          <PhotoList />
        )}
        {showSiderScreen && siderScreenTag === SiderScreenType.deleted && (
          <PhotoRemovedList goBack={onCloseSiderScreen} />
        )}
      </Animated.View>
      {/* <PhotoList /> */}
      <View style={[tw`flex-row gap-2`]}>
        <TouchableOpacity onPress={() => openPhotoList()}>
          <View style={[tw`rounded-sm bg-slate-400 py-10`]}>
            <Text>All Photos</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Divider style={tw`mt-5`} />
      <View>
        <Text style={[theme.fonts.titleSmall]}>Media Type</Text>
      </View>
      <View
        style={[
          tw`flex-row justify-between py-2 rounded-md px-2`,
          { backgroundColor: theme.colors.secondaryContainer },
        ]}
      >
        <View style={tw`flex-row items-center gap-2`}>
          <TrashIcon size={14} color={theme.colors.onBackground} />
          <Text
            style={[
              { color: theme.colors.onBackground, fontSize: 12 },
              // theme.fonts.labelSmall,
            ]}
          >
            Recent deleted
          </Text>
        </View>
        <TouchableOpacity onPress={() => openRecentDeleted()}>
          <ChevronRightIcon size={14} color={theme.colors.onBackground} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  siderScreen: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 9,
  },
})
