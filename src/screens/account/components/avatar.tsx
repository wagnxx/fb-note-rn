import { Dimensions, Image, SafeAreaView, Text, TouchableHighlight } from 'react-native'
import tw from 'twrnc'
import LinearGradient from 'react-native-linear-gradient'
import { useThemePaper } from '@/context/theme-provider'
import { Button, useTheme } from 'react-native-paper'
import { selectAuth } from '@/features/auth/authSlice'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

const { width, height } = Dimensions.get('window')
const uri =
  'https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsX29mZmljZV8zMF9hX3N0dWRpb19zaG90X29mX2NhdF93YXZpbmdfaW1hZ2VzZnVsbF9ib2R5X182YzRmM2YyOC0wMGJjLTQzNTYtYjM3ZC05NDM0NTgwY2FmNDcucG5n.png'
export default function Avatar({ onPressPhoto = () => {} }) {
  const { user } = useSelector(selectAuth)
  const { isDarkMode } = useThemePaper()
  const theme = useTheme()

  const navigation = useNavigation()

  const handleLogin = () => {
    navigation.navigate('Login' as never)
  }

  return (
    <SafeAreaView
      style={[
        tw`items-center  p-2`,
        {
          width: width,
          height: height * 0.25,
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <LinearGradient
        colors={isDarkMode ? ['#515d51', '#34344e'] : ['lightblue', '#ffffd4']}
        style={[
          {
            width: width,
            height: height * 0.25,
          },
          tw`absolute top-0`,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <TouchableHighlight
        style={{ width: 80, height: 80, borderRadius: 50, overflow: 'hidden' }}
        onPress={onPressPhoto}
      >
        <Image source={{ uri: user?.photoURL || uri }} style={{ width: 80, height: 80 }} />
      </TouchableHighlight>
      {user ? (
        <Text style={[{ color: theme.colors.onBackground }]}>
          {user?.displayName || user?.email}
        </Text>
      ) : (
        <Button
          labelStyle={{
            fontSize: 12,
            lineHeight: 16,
            fontStyle: 'normal',
            fontWeight: '500',
            letterSpacing: 0.5,
          }}
          contentStyle={{ paddingVertical: 0 }}
          textColor="#f88"
          onPress={handleLogin}
        >
          Login
        </Button>
      )}

      <Text style={[{ color: theme.colors.onBackground }]}>{user?.uid}</Text>
    </SafeAreaView>
  )
}
