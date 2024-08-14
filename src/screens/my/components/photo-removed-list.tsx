import {
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeftIcon } from 'react-native-heroicons/outline'
import { Checkbox, useTheme } from 'react-native-paper'
import tw from 'twrnc'
import { getPhotos } from '@/service/basic'
import { CheckboxGroup, CheckboxItemProps } from '@/components/group-checkbox'
import { itemSize } from './photo-list'

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
  const checkboxGroupRef = useRef<{ resetSelections: () => void }>(null)

  const recover = () => {
    if (!selections.length) return
  }

  const onItemLongPress = () => {
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
    <View style={[tw`py-2`]}>
      <View style={tw`p-2 `}>
        <TouchableOpacity onPress={goBack}>
          <ArrowLeftIcon color={theme.colors.onBackground} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ padding: 0 }}>
        <View style={[tw`flex-row flex-1  flex-wrap px-2`, { width, gap: 1 }]}>
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
    </View>
  )
}
