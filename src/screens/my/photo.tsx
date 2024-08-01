import { COL_PHOTO, getPhotos, uploadImageToFirebase } from '@/service/basic'
import React, { useEffect, useState } from 'react'
import {
  View,
  FlatList,
  Image,
  Dimensions,
  Button,
  StyleSheet,
} from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import { ProgressBar } from 'react-native-paper'
import tw from 'twrnc'

const numColumns = 3
const screenWidth = Dimensions.get('window').width
const itemSize = screenWidth / numColumns // 每个项的宽度

interface ImageItem {
  id: string
  uri: string
}
let id = 10000
const PhotoScreen: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([])
  const [progress, setProgress] = useState(0)

  const fetchRemotePhotos = () => {
    getPhotos().then(res => {
      console.log('photos::', res)
      setImages(res)
    })
  }

  const onProgress = (progressText: number) => {
    setProgress(progressText)
  }

  const selectImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', selectionLimit: 0 },
      async response => {
        if (response.didCancel) {
          console.log('User cancelled image picker')
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage)
        } else {
          // console.log('Selected image: ', response.assets)
          if (!response?.assets?.length) return

          const imgs = response.assets.map(item => ({
            id: ++id,
            uri: item.uri,
            fileName: item.fileName,
          }))
          setImages(preImages => {
            return [...preImages, ...imgs]
          })

          // setImages(response.assets);
          for (const item of imgs) {
            await uploadImageToFirebase({
              uri: item.uri as string,
              fileName: item.fileName,
              onProgress,
              photosCollection: COL_PHOTO,
            })
            setProgress(0)
          }
        }
      },
    )
  }

  useEffect(() => {
    fetchRemotePhotos()
  }, [])

  const renderItem = ({ item }: { item: ImageItem }) => (
    <View style={[tw`flex-1`, { height: screenWidth / numColumns, margin: 1 }]}>
      <Image
        source={{ uri: item.uri }}
        style={[
          // tw`size-full`,
          styles.image,
          { resizeMode: 'cover' },
        ]}
      />
    </View>
  )

  return (
    <View style={[tw`flex-1 p-1 bg-slate-50`]}>
      {progress > 0 && (
        <ProgressBar style={{ height: 20, marginTop: 0 }} progress={progress} />
      )}
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={numColumns}
      />
      <Button title="Select Image" onPress={selectImage} />
    </View>
  )
}
const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 1,
  },
  image: {
    width: itemSize,
    height: itemSize,
    borderRadius: 5,
  },
})
export default PhotoScreen
