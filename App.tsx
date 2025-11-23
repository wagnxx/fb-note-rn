/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import { ThemePaperProvider } from './src/context/theme-provider'
import AuthNavigator from './src/navigation/auth-navigator'
import TrackPlayer from 'react-native-track-player'
import { addEventListeners, setupPlayer } from './src/utils/service'
import { Provider } from 'react-redux'
import { store, persistor } from './src/store'
import { PersistGate } from 'redux-persist/integration/react'
// 注册播放服务
TrackPlayer.registerPlaybackService(() => addEventListeners)
function App(): React.JSX.Element {
  useEffect(() => {
    const initTrackPlayer = async () => {
      await setupPlayer()
    }

    initTrackPlayer()

    return () => {
      TrackPlayer.stop()
    }
  }, [])

  return (
    <ThemePaperProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <AuthNavigator />
            <Toast />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </ThemePaperProvider>
  )
}

export default App
