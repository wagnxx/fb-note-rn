// import firebase from '@react-native-firebase/app'
// import { getFirestore, onSnapshot } from '@react-native-firebase/firestore'
import { getFirestore  } from '@react-native-firebase/firestore'
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_DATABASE_URL,
} from '@env'

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
  databaseURL: FIREBASE_DATABASE_URL,
}

let app
/**
 * web api 不适合RN
 在 React Native Firebase：

✔ 不需要配置 apiKey / authDomain / projectId 等字段
✔ 不使用 JS 初始化
✔ 不使用 firebase.initializeApp(firebaseConfig)

RN Firebase 100％使用 原生初始化：

Android 依赖：google-services.json

iOS 依赖：GoogleService-Info.plist

🔹 也就是说：

你必须提供 google-services.json，否则 RN Firebase 无法工作，也无法自动初始化 DEFAULT app。
 */

// Initialize Firebase
// if (!firebase.apps.length) {
//   app = firebase.initializeApp(firebaseConfig)
// }
// console.log('Initialize Firebase succesfully ,firebase app length:::::::::::', firebase.apps.length)

// const db = getFirestore()
// export { firebase, app, db, onSnapshot }


const db = getFirestore()
export { db }