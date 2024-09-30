import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Button, Divider, useTheme } from 'react-native-paper'
import tw from 'twrnc'
import { messageConfirm } from '@/utils/utilsAlert'

type JSONAvalable = object | null | boolean | number | string

const StorageManage = () => {
  const theme = useTheme()

  const [storageKeys, setStorageKeys] = useState<string[]>([])
  const [currentJson, setCurrentJson] = useState<JSONAvalable>(null)
  const [currentKey, setCurrentKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [removedLoading, setRemovedLoading] = useState(false)
  const [removedAllLoading, setRemovedALlLoading] = useState(false)

  const removeAllKeysHandle = useCallback(async () => {
    if (storageKeys.length <= 0) return

    try {
      await messageConfirm({
        message: `Are you sure you want to move these storage keys?`,
      })
      setRemovedALlLoading(true)
      await AsyncStorage.multiRemove(storageKeys)
      setRemovedALlLoading(false)
    } catch (error) {
      setRemovedALlLoading(false)
    }

    refreshpage()
  }, [storageKeys])

  const getCurrentJson = (key: string) => {
    let json: JSONAvalable = null
    setLoading(true)
    AsyncStorage.getItem(key).then(res => {
      try {
        if (key === 'selectedDictId') {
          console.log('selectedDictId key data', res)
        }
        json = JSON.parse(res)
      } catch (error) {
        console.error('AsyncStorage.getItem Error', error)
      }
      setCurrentKey(key)
      setCurrentJson(json)
      setLoading(false)
    })
  }

  const removeStorageItem = useCallback(async () => {
    if (!currentKey) return
    try {
      await messageConfirm({
        message: `Are you sure you want to move the storage key?`,
      })
      setRemovedLoading(true)
      await AsyncStorage.removeItem(currentKey)
      setRemovedLoading(false)
    } catch (error) {
      setRemovedLoading(false)
    }
    refreshpage()
  }, [currentKey])

  const refreshpage = () => {
    AsyncStorage.getAllKeys().then(keys => setStorageKeys(keys))
    setCurrentJson(null)
    setCurrentKey(null)
  }

  useEffect(() => {
    refreshpage()
  }, [])

  return (
    <View style={[tw`p-2`]}>
      <View style={[tw`justify-between flex-row items-center`]}>
        <Text style={[theme.fonts.titleMedium, { color: theme.colors.onBackground }]}>
          KEYS LIST
        </Text>
        <Button
          disabled={removedAllLoading || storageKeys.length <= 0}
          loading={removedAllLoading}
          style={[{ backgroundColor: theme.colors.errorContainer }]}
          onPress={removeAllKeysHandle}
        >
          <Text style={{ color: theme.colors.onErrorContainer }}>Remove All Keys</Text>
        </Button>
      </View>
      <View>
        {storageKeys.length > 0 && (
          <View style={[tw``]}>
            {storageKeys.map(key => (
              <TouchableOpacity key={key} onPress={() => getCurrentJson(key)}>
                <Text>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <Divider />

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.outline} />
      ) : !currentJson ? null : (
        <View>
          <View style={[tw`flex-row items-center justify-between py-2`]}>
            <Text style={[theme.fonts.titleMedium, { color: theme.colors.onBackground }]}>
              currentKey: {currentKey}
            </Text>
            <Button
              disabled={removedLoading}
              loading={removedLoading}
              onPress={() => removeStorageItem()}
              style={[{ backgroundColor: theme.colors.errorContainer }]}
            >
              <Text style={{ color: theme.colors.onErrorContainer }}>
                {removedLoading ? ' ...' : 'Removed'}
              </Text>
            </Button>
          </View>
          <ScrollView>
            <Text>{JSON.stringify(currentJson, null, 1)}</Text>
          </ScrollView>
        </View>
      )}
    </View>
  )
}

export default StorageManage
