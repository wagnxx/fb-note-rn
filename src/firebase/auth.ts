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

const auth = firebaseAuth()

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

export { auth, loginUser, registerUser, logoutUser }
