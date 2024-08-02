import { Dimensions, ImageRequireSource, StyleSheet, View } from 'react-native'
import React from 'react'
import ProfileListItem from './profile-list-item'
import tw from 'twrnc'
import { developWarn } from '@/utils/utilsAlert'
import {
  FilmIcon,
  MusicalNoteIcon,
  PhotoIcon,
} from 'react-native-heroicons/outline'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { RootStackParamList, ScrennTypeEnum } from '@/types/screen'
import { useTheme } from 'react-native-paper'
const { width } = Dimensions.get('window')

export enum Actions {
  apply,
  record,
  help,
  settings,
  video,
  music,
  photo,
}

export type SvgProps = {
  color?: string
  size?: number
}

export type ItemType = {
  label: string
  icon?: ImageRequireSource
  IconElement?: React.FC<SvgProps>
  name: Actions
}

const itemsList: ItemType[] = [
  {
    label: '我的申请',
    icon: require('../../../assets/images/wd-sq.png'),
    name: Actions.apply,
  },
  {
    label: '浏览记录',
    icon: require('../../../assets/images/wd-lljl.png'),
    name: Actions.record,
  },
  {
    label: '帮助中心',
    icon: require('../../../assets/images/wd-bzzx.png'),
    name: Actions.help,
  },
  {
    label: '设置',
    icon: require('../../../assets/images/wd-sz.png'),
    name: Actions.settings,
  },
  {
    label: '相册',
    IconElement: prop => <PhotoIcon size={ICON_SIZE} {...prop} />,
    name: Actions.photo,
  },
  {
    label: '视频',
    IconElement: prop => <FilmIcon size={ICON_SIZE} {...prop} />,
    name: Actions.video,
  },
  {
    label: '音乐',
    IconElement: prop => <MusicalNoteIcon size={ICON_SIZE} {...prop} />,
    name: Actions.music,
  },
]

type ProfileListProps = {
  onSettingsDrawerOpen: () => void
}

const avalibleWidth = width - 12 * 4 - 8 * 2
export const ITEM_WIDTH = avalibleWidth / 5
const ICON_SIZE = 23.5
export default function ProfileList({
  onSettingsDrawerOpen,
}: ProfileListProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const theme = useTheme()

  const onItemPress = (item: ItemType) => {
    switch (item.name) {
      case Actions.settings:
        onSettingsDrawerOpen()
        break
      case Actions.photo:
        navigation.navigate(ScrennTypeEnum.Photo)
        break
      case Actions.music:
        navigation.navigate(ScrennTypeEnum.Music)
        break
      default:
        developWarn()
    }
  }

  return (
    <View
      style={[
        tw`flex-row gap-3 flex-wrap  flex-1 p-2`,
        // { backgroundColor: 'red' },
        // { backgroundColor: theme.colors.background },
      ]}
    >
      {itemsList.map((item, index) => (
        <ProfileListItem
          width={ITEM_WIDTH}
          key={index}
          item={item}
          iconStyle={styles.imageIcon}
          onItemPress={() => onItemPress(item)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  imageIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
})
