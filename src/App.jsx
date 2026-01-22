import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider } from '@shared/context/AppContext'
import { AuthProvider, useAuth } from '@shared/context/AuthContext'
import { ThemeProvider } from '@shared/context/ThemeContext'
import { ToastContainer } from '@shared/components/ui'
import Landing from '@features/landing/Landing'
import AppLayout from '@features/app/layouts/AppLayout'
import { LoginPage, RegisterPage, ForgotPasswordPage } from '@features/auth/pages'
import OnboardingPage from '@features/onboarding/OnboardingPage'
import ManagerDashboard from '@features/manager/pages/ManagerDashboard'
import ManagerTeam from '@features/manager/pages/ManagerTeam'
import ManagerApprovals from '@features/manager/pages/ManagerApprovals'
import ManagerReports from '@features/manager/pages/ManagerReports'
import ConsultantDashboard from '@features/consultant/pages/ConsultantDashboard'
import ConsultantTimesheet from '@features/consultant/pages/ConsultantTimesheet'
import ConsultantLeave from '@features/consultant/pages/ConsultantLeave'
import ConsultantAchievements from '@features/consultant/pages/ConsultantAchievements'
import ProfilePage from '@features/consultant/pages/ProfilePage'
import SettingsPage from '@features/settings/SettingsPage'
import LegalPage from '@features/legal/LegalPage'

// Protection des routes authentifiées
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  // Rediriger vers l'onboarding si pas complété
  if (!user?.hasCompletedOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }
  
  return children
}

// Redirection si déjà connecté
function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuth()
  
  if (isAuthenticated) {
    if (!user?.hasCompletedOnboarding) {
      return <Navigate to="/onboarding" replace />
    }
    return <Navigate to={user?.role === 'manager' ? '/app/manager' : '/app/consultant'} replace />
  }
  
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/legal" element={<LegalPage />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      
      {/* Onboarding */}
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <OnboardingPage />
        </ProtectedRoute>
      } />
      
      {/* Protected App Routes */}
      <Route path="/app" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to={user?.role === 'manager' ? '/app/manager' : '/app/consultant'} replace />} />
        
        {/* Manager Routes */}
        <Route path="manager" element={<ManagerDashboard />} />
        <Route path="manager/team" element={<ManagerTeam />} />
        <Route path="manager/approvals" element={<ManagerApprovals />} />
        <Route path="manager/reports" element={<ManagerReports />} />
        <Route path="manager/profile" element={<ProfilePage />} />
        
        {/* Consultant Routes */}
        <Route path="consultant" element={<ConsultantDashboard />} />
        <Route path="consultant/timesheet" element={<ConsultantTimesheet />} />
        <Route path="consultant/leave" element={<ConsultantLeave />} />
        <Route path="consultant/achievements" element={<ConsultantAchievements />} />
        <Route path="consultant/profile" element={<ProfilePage />} />
        
        {/* Shared Routes */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
          <ToastContainer />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

