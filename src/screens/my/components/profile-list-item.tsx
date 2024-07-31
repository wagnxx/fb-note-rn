import { Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { useTheme } from 'react-native-paper'
import { ItemType } from './profile-list'
import { SvgProps } from 'react-native-svg'

type ProfileListItemProps = {
  item: ItemType
  iconStyle: object
  onItemPress: () => void
}
const ProfileListItem = ({
  item,
  iconStyle,
  onItemPress,
}: ProfileListItemProps) => {
  const theme = useTheme()

  const IconElement = item.IconElement as React.FC<SvgProps>

  return (
    <TouchableOpacity
      onPress={onItemPress}
      style={[
        tw`justify-between items-center gap-2 px-3 pb-2 pt-2 mt-2 border-b-gray-100`,
        { borderBottomWidth: 1 },
      ]}
    >
      {item.icon && <Image style={[iconStyle]} source={item.icon} />}

      {!item.icon && <IconElement color={theme.colors.onBackground} />}
      <Text
        style={[{ color: theme.colors.onBackground }, theme.fonts.labelSmall]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  )
}

export default ProfileListItem
