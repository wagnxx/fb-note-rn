import {
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Text,
} from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeftIcon, XMarkIcon } from 'react-native-heroicons/outline'
import { Checkbox, useTheme } from 'react-native-paper'
import tw from 'twrnc'
import { batchUpdatePhotos, getPhotos } from '@/service/basic'
import { CheckboxGroup, CheckboxItemProps } from '@/components/group-checkbox'
import { itemSize } from './photo-list'
import { messageConfirm } from '@/utils/utilsAlert'
import Toast from 'react-native-toast-message'

interface ImageItem {
  id: string
  uri: string
}
type PhotoRemovedListProps = {
  goBack: () => void
}

const { width, height } = Dimensions.get('window')

const RenderItem: React.FC<
  {
    item: ImageItem
    setpreviewImage?: (item: ImageItem | null) => void
    onItemLongPress: () => void
    showCheckbox: boolean
  } & CheckboxItemProps
> = ({
  item,
  setpreviewImage = () => {},
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
    <TouchableWithoutFeedback
      onPress={() => setpreviewImage(item)}
      onLongPress={onItemLongPress}
    >
      <Image
        source={{ uri: item.uri }}
        style={[{ width: '100%', height: '100%', resizeMode: 'cover' }]}
      />
    </TouchableWithoutFeedback>
  </View>
)

export default function PhotoRemovedList({ goBack }: PhotoRemovedListProps) {
  const theme = useTheme()
  const [images, setImages] = useState<ImageItem[]>([])

  const [selections, setSelections] = useState([])
  const [showCheckbox, setShowCheckbox] = useState(false)
  const checkboxGroupRef = useRef<{
    resetSelections: () => void
    toggleSelectAll: () => void
  }>(null)

  const onRecoverHandle = async () => {
    if (!selections.length) return

    try {
      await messageConfirm({
        message: `Are you sure you want to recover these pictures?`,
      })

      batchUpdatePhotos(
        selections,
        selections.map(item => ({ id: item, removed: false })),
      ).then(res => {
        if (res) {
          Toast.show({
            type: 'success',
            text1: 'recover successfuly',
            position: 'top',
            visibilityTime: 3000,
          })
          fetchRemotePhotos()
          checkboxGroupRef.current?.resetSelections()
        } else {
          Toast.show({
            type: 'error',
            text1: 'recover failed',
            position: 'top',
            visibilityTime: 3000,
          })
        }
      })
    } catch (error) {}
  }

  const onItemLongPress = () => {
    console.log('on item long press')
    if (!showCheckbox) setShowCheckbox(true)
  }

  const closeShowCheckBox = () => {
    setShowCheckbox(false)
    checkboxGroupRef.current?.resetSelections()
  }

  const fetchRemotePhotos = () => {
    getPhotos(false).then(res => {
      // console.log('photos::', res)
      setImages(res)
    })
  }

  const onSelectionsChange = useCallback(items => {
    setSelections(items)
  }, [])

  useEffect(() => {
    fetchRemotePhotos()
  }, [])

  return (
    <View style={[tw`py-2 h-full w-full relative`]}>
      {!showCheckbox && (
        <View style={tw`p-2 flex-row gap-2 items-center`}>
          <TouchableOpacity onPress={goBack}>
            <ArrowLeftIcon color={theme.colors.onBackground} />
          </TouchableOpacity>
          <View style={[tw``]}>
            <Text
              style={[
                theme.fonts.titleSmall,
                { color: theme.colors.onBackground },
              ]}
            >
              Recent removed
            </Text>
            <Text style={[theme.fonts.bodySmall]}>{images.length} items</Text>
          </View>
        </View>
      )}
      {showCheckbox && (
        <View style={tw`p-2 flex-row  items-center gap-2`}>
          <TouchableOpacity onPress={closeShowCheckBox}>
            <XMarkIcon color={theme.colors.onBackground} />
          </TouchableOpacity>
          <Text
            style={[
              theme.fonts.titleSmall,
              { color: theme.colors.onBackground },
            ]}
          >
            Select Item: {selections.length}
          </Text>
          <TouchableOpacity
            style={[tw`ml-auto`]}
            onPress={() => checkboxGroupRef.current?.toggleSelectAll()}
          >
            <Text>Select All</Text>
          </TouchableOpacity>
        </View>
      )}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[tw`flex-row   flex-wrap px-2 `, { width, gap: 1 }]}>
          <CheckboxGroup onChange={onSelectionsChange} ref={checkboxGroupRef}>
            {images?.length > 0 &&
              images.map((item, index) => {
                return (
                  <RenderItem
                    showCheckbox={showCheckbox}
                    onItemLongPress={onItemLongPress}
                    checkboxItemId={item.id}
                    item={item}
                    key={index}
                  />
                )
              })}
          </CheckboxGroup>
        </View>
      </ScrollView>

      {showCheckbox && (
        <View
          style={[
            tw`absolute bottom-0 left-0 right-0 bg-white z-10 py-3 flex-row justify-center  `,
          ]}
        >
          <TouchableOpacity onPress={onRecoverHandle}>
            <Text
              style={[
                theme.fonts.labelMedium,
                {
                  color:
                    selections.length > 0
                      ? theme.colors.onBackground
                      : theme.colors.onSurfaceDisabled,
                },
              ]}
            >
              Reover
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
