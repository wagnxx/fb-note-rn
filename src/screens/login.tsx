import { googleLogin, loginUser, sendPasswordResetEmail } from '@/firebase/auth'
import { FC, useState } from 'react'
import { View, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Text } from 'react-native'
import {
  TextInput,
  Button,
  Card,
  Title,
  HelperText,
  Snackbar,
  Portal,
  Modal,
} from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons'
import tw from 'twrnc'

const LoginScreen: FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [visible, setVisible] = useState(false)

  const [showResetModal, setShowResetModal] = useState(false)
  const [resetEmail, setResetEmail] = useState('')

  const handleLogin = () => {
    let isValid = true

    if (!username) {
      setUsernameError('Username is required')
      isValid = false
    } else setUsernameError('')

    if (!password) {
      setPasswordError('Password is required')
      isValid = false
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long')
      isValid = false
    } else setPasswordError('')

    if (!isValid) return

    loginUser(username, password)
      .then(res => {
        if (res) {
          setVisible(true)
          navigation.navigate('HomeTabs', { screen: 'tag' })
        }
      })
      .catch(err => console.log('login error:::::', err))
  }

  const handleGoogleLogin = () => {
    console.log('Google Login')
    googleLogin()
      .then(user => {
        if (user) {
          setVisible(true)
          navigation.navigate('HomeTabs', { screen: 'tag' })
        }
      })
      .catch(err => console.log('Google login error:::::', err))
  }

  const handlePasswordReset = () => {
    if (!resetEmail) {
      Alert.alert('错误', '请输入邮箱地址')
      return
    }

    sendPasswordResetEmail(resetEmail)
      .then(() => {
        Alert.alert('成功', '密码重置邮件已发送，请前往邮箱查看')
        setShowResetModal(false)
        setResetEmail('')
      })
      .catch(err => Alert.alert('失败', err.message))
  }

  return (
    <View style={tw`flex-1 justify-center px-6`}>
      {/* 登录成功提示 */}
      {visible && (
        <SafeAreaView>
          <Snackbar
            visible={visible}
            duration={1500}
            onDismiss={() => setVisible(false)}
            wrapperStyle={{ position: 'absolute', top: 0 }}
          >
            Login Successful!
          </Snackbar>
        </SafeAreaView>
      )}

      {/* 重置密码 Modal */}
      <Portal>
        <Modal
          visible={showResetModal}
          onDismiss={() => setShowResetModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>重置密码</Title>

          <TextInput
            label="请输入注册邮箱"
            value={resetEmail}
            onChangeText={setResetEmail}
            style={styles.input}
          />

          <Button mode="contained" onPress={handlePasswordReset} style={{ marginTop: 10 }}>
            发送重置邮件
          </Button>

          <Button mode="text" onPress={() => setShowResetModal(false)} style={{ marginTop: 6 }}>
            返回登录
          </Button>
        </Modal>
      </Portal>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Welcome Back 👋</Title>

          {/* 用户名 */}
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            error={!!usernameError}
          />
          {!!usernameError && <HelperText type="error">{usernameError}</HelperText>}

          {/* 密码 */}
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            error={!!passwordError}
          />
          {!!passwordError && <HelperText type="error">{passwordError}</HelperText>}

          {/* 登录按钮 */}
          <Button mode="contained" onPress={handleLogin} style={styles.loginButton}>
            Login
          </Button>

          {/* 忘记密码（打开弹框） */}
          <TouchableOpacity onPress={() => setShowResetModal(true)} style={tw`mt-2 mb-4`}>
            <Text style={tw`text-blue-600 text-right`}>忘记密码？</Text>
          </TouchableOpacity>

          {/* 第三方登录 Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <View>
              <Title style={styles.dividerText}>or continue with</Title>
            </View>
            <View style={styles.divider} />
          </View>

          {/* Google 登录 */}
          <View style={styles.socialContainer}>
            <Button
              mode="outlined"
              icon={() => <Ionicons name="logo-google" size={18} color="#DB4437" />}
              onPress={handleGoogleLogin}
              style={styles.socialButton}
            >
              Google
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 20,
    borderRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  dividerContainer: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    width: '48%',
    paddingVertical: 4,
    borderRadius: 8,
  },

  /* Modal 样式 */
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 12,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 20,
    fontWeight: '600',
  },
})

export default LoginScreen
