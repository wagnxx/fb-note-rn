import React from 'react'
import { Text, StyleSheet, Animated, SafeAreaView } from 'react-native'

const HEADER_MAX_HEIGHT = 100
const HEADER_MIN_HEIGHT = 50

type HeaderScrollViewProps = {
  children: JSX.Element
  title?: string
  titleStyle?: object
  containerStyle?: object
  headerContainerStyle?: object
  HeaderComponent?: React.Fc
  scrollContainerStyle?: object
  scrollViewProps?: object
}

const HeaderScrollView = ({
  children,
  title = '',
  titleStyle = {},
  containerStyle = {},
  headerContainerStyle = {},
  HeaderComponent = () => <Text>Header</Text>,
  scrollContainerStyle = {},
  scrollViewProps = {},
}: HeaderScrollViewProps) => {
  const scrollY = new Animated.Value(0)

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  })

  // const headerOpacity = scrollY.interpolate({
  //   inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
  //   outputRange: [1, 1],
  //   extrapolate: 'clamp',
  // })

  // const [contentPaddingTop, setContentPaddingTop] = useState(HEADER_MAX_HEIGHT)

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <Animated.View
        style={[styles.header, { height: headerHeight }, headerContainerStyle]}
      >
        {title && <Text style={[styles.headerText, titleStyle]}>{title} </Text>}
        {!title && <HeaderComponent />}
      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={[styles.scrollViewContent, scrollContainerStyle]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        {...scrollViewProps}
      >
        {children}
      </Animated.ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollViewContent: {
    paddingTop: HEADER_MAX_HEIGHT,
    borderColor: '#ff0',
    padding: 20,
  },
  content: {
    paddingHorizontal: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
})

export default HeaderScrollView
