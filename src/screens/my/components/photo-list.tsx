import { CheckboxGroup, CheckboxItemProps } from '@/components/group-checkbox'
import HeaderScrollView from '@/components/header-scroll-view'
import {
  batchUpdatePhotos,
  COL_PHOTO,
  getPhotos,
  uploadImageToFirebase,
} from '@/service/basic'
import { messageConfirm } from '@/utils/utilsAlert'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native'
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from 'react-native-heroicons/outline'
import { launchImageLibrary } from 'react-native-image-picker'
import { Checkbox, ProgressBar, useTheme } from 'react-native-paper'
import Toast from 'react-native-toast-message'
import tw from 'twrnc'
import PhotoPreview, { SwipeDirection } from './photo-preview'

const numColumns = 3
const itemMargin = 0
const { width, height } = Dimensions.get('window')
export const itemSize =
  (width - 8 * 2 - 1 * (numColumns - 1) - itemMargin * (numColumns * 2)) /
  numColumns // 每个项的宽度

interface ImageItem {
  id: string
  uri: string
}

const HeaderComponent: React.FC<{
  selectImageToAdd: () => void
  selections: string[]
  showCheckbox: boolean
  onCloseShowCheckBox: () => void
  onRemove: () => void
  goBack: () => void
}> = ({
  selectImageToAdd,
  selections,
  showCheckbox,
  onCloseShowCheckBox,
  onRemove,
  goBack,
}) => {
  const theme = useTheme()
  // const navigation = useNavigation()
  // const goBack = () => {
  //   if (navigation.canGoBack()) {
  //     navigation.goBack()
  //   }
  // }
  return (
    <View
      style={[
        tw`flex-row justify-between items-center flex-1  px-2`,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <StatusBar hidden />
      <TouchableOpacity onPress={goBack}>
        <ArrowLeftIcon color={theme.colors.onBackground} />
      </TouchableOpacity>
      {showCheckbox && (
        <>
          <TouchableOpacity onPress={onRemove}>
            <TrashIcon
              color={
                selections?.length > 0
                  ? theme.colors.onBackground
                  : theme.colors.onSurfaceDisabled
              }
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onCloseShowCheckBox}>
            <XMarkIcon color={theme.colors.onBackground} />
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity onPress={selectImageToAdd}>
        <PlusIcon size={36} color={theme.colors.onBackground} />
      </TouchableOpacity>
      {/* <Button title="Select Image" onPress={selectImage} /> */}
    </View>
  )
}

const RenderItem: React.FC<
  {
    item: ImageItem
    setpreviewImage: (item: ImageItem | null) => void
    onItemLongPress: () => void
    showCheckbox: boolean
  } & CheckboxItemProps
> = ({
  item,
  setpreviewImage,
  onItemLongPress,
  checkboxItemId,
  onChange,
  checked,
  showCheckbox,
}) => (
  <View
    style={[
      {
        backgroundColor: '#ddd',
        position: 'relative',
        width: itemSize,
        height: itemSize * 1.4,
      },
    ]}
    key={item.id}
  >
    <View
      style={{
        position: 'absolute',
        zIndex: 3,
        left: 0,
        top: 0,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        width: '50%',
        height: 40,
      }}
    >
      {showCheckbox && (
        <Checkbox.Item
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => onChange?.(checkboxItemId!)}
          label=""
          color="red"
          position={'trailing'}
          style={{
            alignItems: 'flex-start',
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}
        />
      )}
    </View>
    <TouchableOpacity
      onPress={() => setpreviewImage(item)}
      onLongPress={onItemLongPress}
    >
      <Image
        source={{ uri: item.uri }}
        style={[{ width: '100%', height: '100%', resizeMode: 'cover' }]}
      />
    </TouchableOpacity>
  </View>
)

const PhotoList: React.FC<{ goBack: () => void }> = ({ goBack }) => {
  const theme = useTheme()
  const [images, setImages] = useState<ImageItem[]>([])
  const [previewIndex, setpreviewIndex] = useState<number>(-1)
  const [progress, setProgress] = useState(0)
  const [selections, setSelections] = useState([])
  const [showCheckbox, setShowCheckbox] = useState(false)
  const checkboxGroupRef = useRef<{ resetSelections: () => void }>(null)

  const previewImage = useMemo(() => {
    return images[previewIndex]
  }, [images, previewIndex])

  const onItemLongPress = () => {
    if (!showCheckbox) setShowCheckbox(true)
  }

  const closeShowCheckBox = () => {
    setShowCheckbox(false)
    checkboxGroupRef.current?.resetSelections()
  }

  const handleImageSwipe = (dir: SwipeDirection) => {
    let curIndex = previewIndex
    if (dir === SwipeDirection.left) {
      ++curIndex
    }
    if (dir === SwipeDirection.right) {
      --curIndex
    }
    if (curIndex < 0 || curIndex >= images.length) {
      curIndex = -1
    }
    setpreviewIndex(curIndex)
  }

  const refreshPage = () => {
    fetchRemotePhotos()
    setShowCheckbox(false)
  }
  const fetchRemotePhotos = () => {
    getPhotos().then(res => {
      // console.log('photos::', res)
      setImages(res)
    })
  }
  const onRemove = () => {
    console.log('remove handle', selections)
    if (!selections.length) return
    // batchUpdatePhotos
    messageConfirm({
      message: 'Are you sure you want to remove these?',
    }).then(() => {
      console.log('sure')
      batchUpdatePhotos(
        selections,
        selections.map(item => ({ id: item, removed: true })),
      ).then(res => {
        if (res) {
          Toast.show({
            type: 'success',
            text1: 'removed successfuly',
            position: 'top',
            visibilityTime: 3000,
          })
          refreshPage()
          checkboxGroupRef.current?.resetSelections()
        } else {
          Toast.show({
            type: 'error',
            text1: 'removed failed',
            position: 'top',
            visibilityTime: 3000,
          })
        }
      })
    })
  }

  const onProgress = (progressText: number) => {
    setProgress(progressText)
  }

  const selectImageToAdd = () => {
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

  const onSelectionsChange = useCallback(items => {
    setSelections(items)
  }, [])

  useEffect(() => {
    fetchRemotePhotos()
  }, [])

  return (
    <>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <HeaderScrollView
          headerElement={
            <HeaderComponent
              selectImageToAdd={selectImageToAdd}
              selections={selections}
              showCheckbox={showCheckbox}
              onCloseShowCheckBox={closeShowCheckBox}
              onRemove={onRemove}
              goBack={goBack}
            />
          }
          headerContainerStyle={{
            flexDirection: 'row',
            alignItems: 'stretch',
          }}
          minHeight={30}
        >
          <View style={[tw` pb-5 `, { width }]}>
            {progress > 0 && (
              <ProgressBar
                style={{ height: 20, marginTop: 0 }}
                progress={progress}
              />
            )}
            <View style={[tw`flex-row  flex-wrap px-2`, { width, gap: 1 }]}>
              <CheckboxGroup
                onChange={onSelectionsChange}
                ref={checkboxGroupRef}
              >
                {images?.length > 0 &&
                  images.map((item, index) => {
                    return (
                      <RenderItem
                        showCheckbox={showCheckbox}
                        onItemLongPress={onItemLongPress}
                        checkboxItemId={item.id}
                        item={item}
                        setpreviewImage={() => setpreviewIndex(index)}
                        key={index}
                      />
                    )
                  })}
              </CheckboxGroup>
            </View>
          </View>
        </HeaderScrollView>
      </View>
      {previewImage?.uri && (
        <PhotoPreview
          onSwipe={handleImageSwipe}
          imageUrl={previewImage.uri}
          onClose={() => setpreviewIndex(-1)}
        />
      )}
    </>
  )
}

export default PhotoList
