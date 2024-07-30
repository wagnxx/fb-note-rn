import { StyleSheet } from 'react-native'
import React from 'react'
import ProfileListItem from './profile-list-item'

const styles = StyleSheet.create({
  imageIcon: {
    width: 23.5,
    height: 23.5,
  },
  arrayIcon: {
    width: 10,
    height: 18,
  },
})

const voidFunc = name => {}

export enum Actions {
  apply,
  record,
  help,
  settings,
}

const itemsList = [
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
]

type ProfileListProps = {
  doAction: (name: Actions) => void
}

export default function ProfileList({ doAction = voidFunc }: ProfileListProps) {
  const onItemPress = item => {
    doAction(item.name)
  }
  return itemsList.map((item, index) => (
    <ProfileListItem
      key={index}
      label={item.label}
      icon={item.icon}
      iconStyle={styles.imageIcon}
      onItemPress={() => onItemPress(item)}
    />
  ))
}
