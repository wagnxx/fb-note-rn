import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Button, Divider, useTheme } from 'react-native-paper'
import tw from 'twrnc'

type JSONAvalable = object | null | boolean | number | string

const StorageManage = () => {
  const theme = useTheme()
  const [showStorageKeys, setShowStorageKeys] = useState(false)
  const [storageKeys, setStorageKeys] = useState<string[]>([])
  const [currentJson, setCurrentJson] = useState<JSONAvalable>(null)
  const [currentKey, setCurrentKey] = useState<string | null>(null)

  const getCurrentJson = (key: string) => {
    let json: object | null | boolean | number = null
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
    })
  }

  const removeStorageItem = () => {
    if (!currentKey) return
    AsyncStorage.removeItem(currentKey)
  }

  useEffect(() => {
    AsyncStorage.getAllKeys().then(Keys => setStorageKeys(Keys))
  }, [])

  return (
    <View style={[tw`p-2`]}>
      <Button onPress={() => setShowStorageKeys(!showStorageKeys)}>showStorageKeys</Button>

      {storageKeys.length > 0 && (
        <View style={[tw``]}>
          {storageKeys.map(key => (
            <TouchableOpacity key={key} onPress={() => getCurrentJson(key)}>
              <Text>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Divider />

      {currentJson && (
        <View>
          <View style={[tw`flex-row items-center justify-between py-2`]}>
            <Text>currentKey: {currentKey}</Text>
            <Button
              onPress={() => removeStorageItem()}
              style={[{ backgroundColor: theme.colors.errorContainer }]}
            >
              <Text style={{ color: theme.colors.onErrorContainer }}>Removed</Text>
            </Button>
          </View>
          <Text>{JSON.stringify(currentJson, null, 1)}</Text>
        </View>
      )}
    </View>
  )
}

export default StorageManage
