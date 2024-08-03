import HeaderScrollView from '@/components/header-scroll-view'
import { COL_PHOTO, getPhotos, uploadImageToFirebase } from '@/service/basic'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import {
  ArrowLeftIcon,
  PlusIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline'
import { launchImageLibrary } from 'react-native-image-picker'
import { ProgressBar, useTheme } from 'react-native-paper'
import tw from 'twrnc'

const numColumns = 3
const itemMargin = 0
const { width, height } = Dimensions.get('window')
const itemSize =
  (width - 8 * 2 - 1 * (numColumns - 1) - itemMargin * (numColumns * 2)) /
  numColumns // 每个项的宽度

interface ImageItem {
  id: string
  uri: string
}
let id = 10000

const HeaderComponent = ({ selectImage }) => {
  const theme = useTheme()
  const navigation = useNavigation()
  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    }
  }
  return (
    <View
      style={[
        tw`flex-row justify-between items-center flex-1  px-2`,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <TouchableOpacity onPress={goBack}>
        <ArrowLeftIcon color={theme.colors.onBackground} />
      </TouchableOpacity>
      <TouchableOpacity onPress={selectImage}>
        <PlusIcon size={36} color={theme.colors.onBackground} />
      </TouchableOpacity>
      {/* <Button title="Select Image" onPress={selectImage} /> */}
    </View>
  )
}
const RenderItem = ({
  item,
  setpreviewImage,
}: {
  item: ImageItem
  setpreviewImage: (item: ImageItem | null) => void
}) => (
  <View style={[tw``, styles.image, { backgroundColor: '#ddd' }]} key={item.id}>
    <TouchableOpacity onPress={() => setpreviewImage(item)}>
      <Image
        source={{ uri: item.uri }}
        style={[
          // tw`size-full`,
          styles.image,
          { resizeMode: 'cover' },
        ]}
      />
    </TouchableOpacity>
  </View>
)
const PhotoScreen: React.FC = () => {
  const theme = useTheme()
  const [images, setImages] = useState<ImageItem[]>([])
  const [previewImage, setpreviewImage] = useState<ImageItem | null>(null)
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

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <HeaderScrollView
        headerElement={<HeaderComponent selectImage={selectImage} />}
        headerContainerStyle={{
          flexDirection: 'row',
          alignItems: 'stretch',
        }}
        minHeight={0}
      >
        <View style={[tw`flex-1 p-1 pb-10 `, { height, width }]}>
          {progress > 0 && (
            <ProgressBar
              style={{ height: 20, marginTop: 0 }}
              progress={progress}
            />
          )}
          {/* <FlatList
            data={images}
            horizontal
            renderItem={renderItem}
            keyExtractor={item => item.id || item.uri}
            // numColumns={numColumns}
          /> */}

          <View
            style={[tw`flex-row flex-1  flex-wrap px-2`, { width, gap: 1 }]}
          >
            {images?.length > 0 &&
              images.map((item, index) => {
                return (
                  <RenderItem
                    item={item}
                    setpreviewImage={setpreviewImage}
                    key={index}
                  />
                )
              })}
          </View>

          {/* <View style={[tw`absolute bottom-0 left-0 right-0 px-2 py-2`]}>
            <Button title="Select Image" onPress={selectImage} />
          </View> */}
        </View>
      </HeaderScrollView>
      {previewImage?.uri && (
        <View
          style={tw`absolute inset-x-0 inset-y-0 bg-black z-10 flex-1 justify-end items-center gap-2`}
        >
          <View style={tw`self-start`}>
            <TouchableOpacity onPress={() => setpreviewImage(null)}>
              <XMarkIcon color={'#fff'} />
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: previewImage?.uri }}
            style={[
              // tw`size-full`,
              // styles.image,
              { height: height * 0.9, width: width * 0.9 },
            ]}
          />
        </View>
      )}
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
    // borderRadius: 5,
  },
})
export default PhotoScreen
