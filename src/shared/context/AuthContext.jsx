import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const AuthContext = createContext(null)

// Utilisateurs de démo
const DEMO_USERS = {
  'paul.martin@kokbif.com': {
    id: 2,
    email: 'paul.martin@kokbif.com',
    password: 'demo123',
    name: 'Paul',
    fullName: 'Paul Martin',
    role: 'consultant',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    level: 12,
    xp: 2350,
    streak: 12,
    hasCompletedOnboarding: false,
  },
  'korian.dupont@kokbif.com': {
    id: 1,
    email: 'korian.dupont@kokbif.com',
    password: 'demo123',
    name: 'Korian',
    fullName: 'Korian Dupont',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    level: 15,
    xp: 3200,
    hasCompletedOnboarding: true,
  },
  'marie.dupont@kokbif.com': {
    id: 3,
    email: 'marie.dupont@kokbif.com',
    password: 'demo123',
    name: 'Marie',
    fullName: 'Marie Dupont',
    role: 'consultant',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    level: 14,
    xp: 2890,
    streak: 8,
    hasCompletedOnboarding: true,
  },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Vérifier la session au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('kokbif_user')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        setUser(parsed)
      } catch (e) {
        localStorage.removeItem('kokbif_user')
      }
    }
    setIsLoading(false)
  }, [])

  // Sauvegarder l'utilisateur dans localStorage
  const saveUser = useCallback((userData) => {
    localStorage.setItem('kokbif_user', JSON.stringify(userData))
    setUser(userData)
  }, [])

  // Connexion
  const login = useCallback(async (email, password, rememberMe = false) => {
    setError(null)
    setIsLoading(true)
    
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const normalizedEmail = email.toLowerCase().trim()
    const demoUser = DEMO_USERS[normalizedEmail]
    
    if (!demoUser) {
      setIsLoading(false)
      setError('Aucun compte trouvé avec cet email')
      return { success: false, error: 'Aucun compte trouvé avec cet email' }
    }
    
    if (demoUser.password !== password) {
      setIsLoading(false)
      setError('Mot de passe incorrect')
      return { success: false, error: 'Mot de passe incorrect' }
    }
    
    // Connexion réussie
    const { password: _, ...userWithoutPassword } = demoUser
    
    if (rememberMe) {
      saveUser(userWithoutPassword)
    } else {
      setUser(userWithoutPassword)
    }
    
    setIsLoading(false)
    return { success: true, user: userWithoutPassword }
  }, [saveUser])

  // Inscription
  const register = useCallback(async (userData) => {
    setError(null)
    setIsLoading(true)
    
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const normalizedEmail = userData.email.toLowerCase().trim()
    
    // Vérifier si l'email existe déjà
    if (DEMO_USERS[normalizedEmail]) {
      setIsLoading(false)
      setError('Un compte existe déjà avec cet email')
      return { success: false, error: 'Un compte existe déjà avec cet email' }
    }
    
    // Créer le nouvel utilisateur
    const newUser = {
      id: Date.now(),
      email: normalizedEmail,
      name: userData.firstName,
      fullName: `${userData.firstName} ${userData.lastName}`,
      role: userData.role || 'consultant',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.firstName}`,
      level: 1,
      xp: 0,
      streak: 0,
      hasCompletedOnboarding: false,
      createdAt: new Date().toISOString(),
    }
    
    // En mode démo, on ajoute juste à la session
    saveUser(newUser)
    setIsLoading(false)
    
    return { success: true, user: newUser }
  }, [saveUser])

  // Déconnexion
  const logout = useCallback(() => {
    localStorage.removeItem('kokbif_user')
    setUser(null)
  }, [])

  // Mot de passe oublié
  const forgotPassword = useCallback(async (email) => {
    setError(null)
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const normalizedEmail = email.toLowerCase().trim()
    
    if (!DEMO_USERS[normalizedEmail]) {
      setIsLoading(false)
      return { success: false, error: 'Aucun compte trouvé avec cet email' }
    }
    
    setIsLoading(false)
    return { success: true, message: 'Email de récupération envoyé !' }
  }, [])

  // Mettre à jour le profil
  const updateProfile = useCallback((updates) => {
    if (!user) return
    
    const updatedUser = { ...user, ...updates }
    saveUser(updatedUser)
  }, [user, saveUser])

  // Marquer l'onboarding comme complété
  const completeOnboarding = useCallback(() => {
    if (!user) return
    
    const updatedUser = { ...user, hasCompletedOnboarding: true }
    saveUser(updatedUser)
  }, [user, saveUser])

  // Ajouter de l'XP
  const addXP = useCallback((amount) => {
    if (!user) return
    
    const newXP = user.xp + amount
    const xpPerLevel = 300
    const newLevel = Math.floor(newXP / xpPerLevel) + 1
    
    const updatedUser = { 
      ...user, 
      xp: newXP,
      level: Math.max(user.level, newLevel)
    }
    saveUser(updatedUser)
    
    return { newXP, newLevel, leveledUp: newLevel > user.level }
  }, [user, saveUser])

  // Quick login pour tests (sans mot de passe)
  const quickLogin = useCallback((role = 'consultant') => {
    const email = role === 'manager' ? 'korian.dupont@kokbif.com' : 'paul.martin@kokbif.com'
    const demoUser = DEMO_USERS[email]
    const { password: _, ...userWithoutPassword } = demoUser
    saveUser(userWithoutPassword)
    return { success: true, user: userWithoutPassword }
  }, [saveUser])

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    quickLogin,
    register,
    logout,
    forgotPassword,
    updateProfile,
    completeOnboarding,
    addXP,
    clearError: () => setError(null),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default AuthContext
