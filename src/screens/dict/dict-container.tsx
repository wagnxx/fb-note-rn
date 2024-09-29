import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AppState, AppStateStatus, BackHandler } from 'react-native'
import DictHome from './dict-home'

const DictContainer = () => {
  const dictHomeRef = useRef<{ saveData: () => void; fetchDataFromRemote: () => void }>(null)
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState)

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background') {
        // 保存数据
        dictHomeRef.current?.saveData()
      }

      if (appState.match(/inactive|background/) && nextAppState === 'active') {
      }

      setAppState(nextAppState)
    },
    [appState],
  )

  const handleBackPress = useCallback((): boolean => {
    // 保存数据
    // console.log('back button pressed, saving data...')
    dictHomeRef.current?.saveData()
    return false // 允许默认行为
  }, [])

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange)
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress)

    return () => {
      appStateSubscription.remove()
      backHandler.remove()
    }
  }, [handleAppStateChange, handleBackPress])

  useEffect(() => {
    console.log(
      '========================= .  Dict Container opend =====================================================',
    )
  }, [])

  return <DictHome ref={dictHomeRef} />
}

export default DictContainer
