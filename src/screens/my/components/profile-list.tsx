import { ImageRequireSource, StyleSheet, View } from 'react-native'
import React from 'react'
import ProfileListItem from './profile-list-item'
import tw from 'twrnc'
import { developWarn } from '@/utils/utilsAlert'
import { FilmIcon, MusicalNoteIcon } from 'react-native-heroicons/outline'

export enum Actions {
  apply,
  record,
  help,
  settings,
  video,
  music,
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
const ICON_SIZE = 23.5

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

export default function ProfileList({
  onSettingsDrawerOpen,
}: ProfileListProps) {
  const onItemPress = (item: ItemType) => {
    switch (item.name) {
      case Actions.settings:
        onSettingsDrawerOpen()
        break
      default:
        developWarn()
    }
  }

  return (
    <View style={[{}, tw`flex-row bg-gray-50 `]}>
      {itemsList.map((item, index) => (
        <ProfileListItem
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
