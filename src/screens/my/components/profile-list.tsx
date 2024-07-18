import { StyleSheet } from 'react-native'
import React from 'react'
import ListItem from './list-item'

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

const itemsList = [
  {
    label: '我的申请',
    icon: require('../../../assets/images/wd-sq.png'),
  },
  {
    label: '浏览记录',
    icon: require('../../../assets/images/wd-lljl.png'),
  },
  {
    label: '帮助中心',
    icon: require('../../../assets/images/wd-bzzx.png'),
  },
  {
    label: '设置',
    icon: require('../../../assets/images/wd-sz.png'),
  },
]

export default function ProfileList() {
  const onItemPress = item => {
    console.log('item pressed:::', item)
  }
  return itemsList.map((item, index) => (
    <ListItem key={index} label={item.label} icon={item.icon} iconStyle={styles.imageIcon} onItemPress={() => onItemPress(item)} />
  ))
}
