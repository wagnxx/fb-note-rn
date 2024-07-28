import React, { createContext, useState, useEffect, useContext } from 'react'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'

// Define the shape of your user object
type User = FirebaseAuthTypes.User | null

// Define the context type
interface AuthContextType {
  user: User
  loadingUser: boolean
}

// Create the context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loadingUser: true,
})

// Create the AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(authUser => {
      setUser(authUser)
      setLoadingUser(false)
    })

    return unsubscribe // Clean up subscription on unmount
  }, [])

  return <AuthContext.Provider value={{ user, loadingUser }}>{children}</AuthContext.Provider>
}

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => useContext(AuthContext)
