"use client"

import { useState, useEffect } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "../lib/firebase-config"
import { getUserById } from "../lib/firebase-queries"
import type { IndividualUser, ServiceProvider, AdminUser } from "../types/firebase-types"

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<IndividualUser | ServiceProvider | AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        try {
          const profile = await getUserById(firebaseUser.uid)
          setUserProfile(profile as IndividualUser | ServiceProvider | AdminUser)
        } catch (error) {
          console.error("Error fetching user profile:", error)
          setUserProfile(null)
        }
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { user, userProfile, loading }
}

export const useFirebaseOperation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeOperation = async (operation: () => Promise<any>): Promise<any | null> => {
    setLoading(true)
    setError(null)

    try {
      const result = await operation()
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      console.error("Firebase operation error:", err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { executeOperation, loading, error }
}
