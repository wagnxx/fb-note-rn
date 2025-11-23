// auth.js

// import { app } from './firebase'
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   signInWithPopup,
//   fetchSignInMethodsForEmail,
//   EmailAuthProvider,
//   signInWithCredential,
//   linkWithCredential,
//   GithubAuthProvider,
//   type Auth,
//   AuthCredential,
//   GoogleAuthProvider,
//   // '@react-native-firebase/auth'
// } from 'firebase/auth'

import firebaseAuth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

import { FIREBASE_OAUTH_CLIENT_ID } from '@env'

const auth = firebaseAuth()
const { GoogleAuthProvider } = firebaseAuth

const { createUserWithEmailAndPassword, signOut } = auth

// 用户登录
const loginUser = async (email: string, password: string) => {
  try {
    await auth.signInWithEmailAndPassword(email, password)
    console.log('User logged in successfully.')
    return true
  } catch (error) {
    console.error('Error logging in user:', error)
    return false
  }
}

// 用户注册
const registerUser = async (email: string, password: string) => {
  try {
    await createUserWithEmailAndPassword(email, password)
    console.log('User registered successfully.')
    return true
  } catch (error) {
    console.error('Error registering user:', error)
    return false
  }
}

// 用户注销
const logoutUser = async () => {
  try {
    // await signOut()
    await auth.signOut()
    console.log('User logged out successfully.')
    return true
  } catch (error) {
    console.error('Error logging out user:', error)
  }
  return null
}

// Google 登录方法
GoogleSignin.configure({
  webClientId: FIREBASE_OAUTH_CLIENT_ID,
})

async function googleLogin() {
  try {
    // 确保 GoogleSignin 初始化过
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })

    // 触发 Google 登录
    const userInfo = await GoogleSignin.signIn()

    if (!userInfo || userInfo.type !== 'success' || !userInfo.data) {
      throw new Error('Google Sign-In did not return idToken.')
    }

    // 使用 Google idToken 构建 Firebase 凭证
    const googleCredential = GoogleAuthProvider.credential(userInfo.data.idToken)

    // Firebase 登录
    const firebaseUserCredential = await auth.signInWithCredential(googleCredential)

    console.log('Firebase User:', firebaseUserCredential.user)

    return firebaseUserCredential.user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Google login error:', error?.message || error)
    return null
  }
}

/**
 * 发送密码重置邮件
 * @param email 用户邮箱
 * @returns Promise<void>
 */
const sendPasswordResetEmail = async (email: string) => {
  if (!email) throw new Error('Email is required')
  return
}
export { auth, loginUser, registerUser, logoutUser, googleLogin, sendPasswordResetEmail }
