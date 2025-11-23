// ResetPasswordScreen.tsx
import { FC, useState, useEffect } from 'react'
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { TextInput, Button, Card, Title, HelperText, Snackbar } from 'react-native-paper'
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native'
import tw from 'twrnc'
import { auth } from '@/firebase/auth' // 你自己的 firebase 初始化

type ResetPasswordParams = {
  ResetPassword: {
    oobCode: string // 邮件链接传过来的 code
  }
}

const ResetPasswordScreen: FC = () => {
  const route = useRoute<RouteProp<ResetPasswordParams, 'ResetPassword'>>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState('')
  const [snackbarVisible, setSnackbarVisible] = useState(false)

  const { oobCode } = route.params

  // Step 1: 验证 oobCode 是否有效，并获取用户邮箱
  useEffect(() => {
    auth
      .verifyPasswordResetCode(oobCode)
      // verifyPasswordResetCode(auth, oobCode)
      .then(email => {
        setEmail(email)
        setLoading(false)
      })
      .catch(err => {
        console.error('Invalid or expired reset code', err)
        Alert.alert('链接无效或已过期')
        navigation.goBack() // 返回登录页面
      })
  }, [navigation, oobCode])

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('密码至少6位')
      return
    } else if (newPassword !== confirmPassword) {
      setPasswordError('两次输入密码不一致')
      return
    } else {
      setPasswordError('')
    }

    setSubmitting(true)
    try {
      await auth.confirmPasswordReset(oobCode, newPassword)
      setSubmitting(false)
      setSnackbarVisible(true)
      setTimeout(() => {
        navigation.navigate('Login') // 重置成功后跳回登录
      }, 1500)
    } catch (err) {
      console.error('Reset password failed:', err)
      Alert.alert('重置失败，请重试')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    )
  }

  return (
    <View style={tw`flex-1 justify-center px-6 bg-white`}>
      <Snackbar
        visible={snackbarVisible}
        duration={1500}
        onDismiss={() => setSnackbarVisible(false)}
        wrapperStyle={{ position: 'absolute', top: 0 }}
      >
        密码重置成功！
      </Snackbar>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Reset Password</Title>
          <HelperText type="info">邮箱: {email}</HelperText>

          <TextInput
            label="新密码"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            error={!!passwordError}
          />
          <TextInput
            label="确认新密码"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            error={!!passwordError}
          />
          {!!passwordError && <HelperText type="error">{passwordError}</HelperText>}

          <Button
            mode="contained"
            onPress={handleResetPassword}
            loading={submitting}
            disabled={submitting}
            style={styles.button}
          >
            重置密码
          </Button>
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
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
})

export default ResetPasswordScreen
