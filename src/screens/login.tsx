import { auth, loginUser } from '@/firebase/auth'
// import { LoginScreenProps } from '@/types/navigation'
import React, { FC } from 'react'
import { View, StyleSheet, SafeAreaView } from 'react-native'
import { TextInput, Button, Card, Title, HelperText, Snackbar } from 'react-native-paper'

import tw from 'twrnc'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LoginScreen: FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [usernameError, setUsernameError] = React.useState('')
  const [passwordError, setPasswordError] = React.useState('')
  const [visible, setVisible] = React.useState(false)

  const handleLogin = () => {
    let isValid = true
    if (username === '') {
      setUsernameError('Username is required')
      isValid = false
    } else {
      setUsernameError('')
    }

    if (password === '') {
      setPasswordError('Password is required')
      isValid = false
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long')
      isValid = false
    } else {
      setPasswordError('')
    }
    if (!isValid) return
    // 在此处理登录逻辑
    // Alert.alert('Login', `Username: ${username}, Password: ${password}`)
    loginUser(username, password)
      .then(res => {
        if (res) {
          setVisible(true)
          console.log('login after, auth?.currentUser is ::::', auth?.currentUser)
          navigation.navigate('HomeTabs', { screen: 'tag' })
          // navigate
        } else {
          setVisible(false)
        }
      })
      .catch(err => {
        console.log('login error:::::', err)
      })
  }

  return (
    <View style={tw`justify-center flex-1`}>
      {visible && (
        <SafeAreaView style={tw`justify-center items-center flex-1`}>
          <Snackbar
            visible={visible}
            duration={Snackbar.DURATION_SHORT}
            onDismiss={() => setVisible(false)}
            wrapperStyle={{ position: 'absolute', top: 0 }}
          >
            Login Successful!
          </Snackbar>
        </SafeAreaView>
      )}
      <Card>
        <Card.Content>
          <Title>Login</Title>
          <TextInput
            label="Username"
            value={username}
            onChangeText={text => setUsername(text)}
            style={styles.input}
            error={!!usernameError}
          />
          {usernameError ? (
            <HelperText type="error" visible={!!usernameError}>
              {usernameError}
            </HelperText>
          ) : null}
          <TextInput
            label="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry
            style={styles.input}
            error={!!passwordError}
          />
          {passwordError ? (
            <HelperText type="error" visible={!!passwordError}>
              {passwordError}
            </HelperText>
          ) : null}
          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Login
          </Button>
        </Card.Content>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
})

export default LoginScreen
