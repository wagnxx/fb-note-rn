import { Text, Image, TouchableOpacity, View } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { useTheme } from 'react-native-paper'
import { ItemType } from './profile-list'
import { SvgProps } from 'react-native-svg'

type ProfileListItemProps = {
  item: ItemType
  iconStyle: object
  onItemPress: () => void
  width: number
}
const ProfileListItem = ({
  item,
  iconStyle,
  onItemPress,
  width,
}: ProfileListItemProps) => {
  const theme = useTheme()

  const IconElement = item.IconElement as React.FC<SvgProps>

  return (
    <TouchableOpacity onPress={onItemPress}>
      <View
        style={[
          tw`justify-between items-center gap-2  my-2  `,
          // { backgroundColor: theme.colors.background },
          { width },
        ]}
      >
        {item.icon && <Image style={[iconStyle]} source={item.icon} />}

        {!item.icon && <IconElement color={theme.colors.onBackground} />}
        <Text
          style={[
            { color: theme.colors.onBackground },
            // { color: 'red' },
            theme.fonts.labelSmall,
          ]}
        >
          {item.label}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default ProfileListItem
