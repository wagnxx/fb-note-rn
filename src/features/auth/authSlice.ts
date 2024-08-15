import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/store' // Adjust path as per your project structure
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

// Define the shape of your user object
type User = FirebaseAuthTypes.User

export interface AuthState {
  user: {
    uid: string | null
    email: string | null
    displayName: string | null
    photoURL: string | null
    // 其他需要的字段
  } | null
  loadingUser: boolean
}

// // Define the initial state
// interface AuthState {
//   user: User
//   loadingUser: boolean
// }

const initialState: AuthState = {
  user: null,
  loadingUser: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState['user'] | null>) => {
      // console.log('action:', action)
      if (action.payload) {
        const { uid, email, displayName, photoURL } = action.payload
        state.user = { uid, email, displayName, photoURL }
      } else {
        state.user = null
      }
      state.loadingUser = false
    },
    setLoadingUser: (state, action: PayloadAction<boolean>) => {
      state.loadingUser = action.payload
    },
  },
})

// Export actions and reducer
export const { setUser, setLoadingUser } = authSlice.actions
export default authSlice.reducer

// Async action to handle auth state changes
export const observeAuthState = () => async (dispatch: any) => {
  const unsubscribe = auth().onAuthStateChanged(authUser => {
    dispatch(setUser(authUser))
  })

  return unsubscribe // Clean up subscription on unmount
}

// Selector to get auth state
export const selectAuth = (state: RootState) => state.auth
