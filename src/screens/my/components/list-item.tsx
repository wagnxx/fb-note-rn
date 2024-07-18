import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { useTheme } from 'react-native-paper'
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

const ListItem = ({ iconStyle, icon, label, onItemPress }) => {
  const theme = useTheme()
  return (
    <View style={[tw`flex-row justify-between pr-3 pl-3 pb-2 pt-2`, { borderColor: theme.colors.primaryContainer, borderWidth: 1 }]}>
      <View style={tw`flex-row gap-2`}>
        <Image style={[iconStyle]} source={icon} />
        <Text style={{ color: theme.colors.onBackground }}>{label}</Text>
      </View>
      <TouchableOpacity onPress={onItemPress}>
        <Image style={[styles.arrayIcon]} source={require('../../../assets/images/go-sq.png')} />
      </TouchableOpacity>
    </View>
  )
}

export default ListItem
