import { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { startOfWeek, addDays, subWeeks, format, getISOWeek, subDays } from 'date-fns'

const AppContext = createContext(null)

// ============================================
// DONNÉES UTILISATEURS
// ============================================
const users = {
  manager: {
    id: 1,
    name: 'Korian',
    fullName: 'Korian Dupont',
    email: 'korian.dupont@kokbif.com',
    role: 'Manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    level: 15,
    xp: 3200,
    department: 'IT Consulting',
  },
  consultant: {
    id: 2,
    name: 'Paul',
    fullName: 'Paul Martin',
    email: 'paul.martin@kokbif.com',
    role: 'Consultant',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    level: 12,
    xp: 2350,
    streak: 12,
  },
}

// ============================================
// ÉQUIPE (12 consultants)
// ============================================
const teamMembers = [
  { id: 2, name: 'Paul Martin', role: 'Consultant Senior', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', email: 'paul.martin@kokbif.com', level: 12, xp: 2350, streak: 12, project: 'BGL - Sprint 12', status: 'active', timesheetStatus: 'submitted', hoursThisWeek: 40 },
  { id: 3, name: 'Marie Dupont', role: 'Senior Consultant', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', email: 'marie.dupont@kokbif.com', level: 14, xp: 2890, streak: 8, project: 'POST - Migration', status: 'active', timesheetStatus: 'submitted', hoursThisWeek: 40 },
  { id: 4, name: 'Julie Martin', role: 'Chef de Projet', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', email: 'julie.martin@kokbif.com', level: 16, xp: 3450, streak: 22, project: 'Clearstream - SI', status: 'active', timesheetStatus: 'approved', hoursThisWeek: 42 },
  { id: 5, name: 'Lucas Bernard', role: 'Dev Full Stack', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', email: 'lucas.bernard@kokbif.com', level: 10, xp: 1950, streak: 0, project: 'BGL - Sprint 12', status: 'late', timesheetStatus: 'draft', hoursThisWeek: 24, daysLate: 5 },
  { id: 6, name: 'Emma Wilson', role: 'Business Analyst', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', email: 'emma.wilson@kokbif.com', level: 11, xp: 2150, streak: 3, project: 'SES - Analytics', status: 'late', timesheetStatus: 'draft', hoursThisWeek: 16, daysLate: 3 },
  { id: 7, name: 'Thomas Weber', role: 'DevOps Engineer', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100', email: 'thomas.weber@kokbif.com', level: 13, xp: 2650, streak: 15, project: 'Internal - Infra', status: 'active', timesheetStatus: 'approved', hoursThisWeek: 40 },
  { id: 8, name: 'Sophie Chen', role: 'UX Designer', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100', email: 'sophie.chen@kokbif.com', level: 9, xp: 1720, streak: 5, project: 'POST - Mobile', status: 'leave', timesheetStatus: 'approved', hoursThisWeek: 32 },
  { id: 9, name: 'Pierre Durand', role: 'Consultant SAP', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100', email: 'pierre.durand@kokbif.com', level: 17, xp: 3890, streak: 45, project: 'Deloitte - SAP', status: 'active', timesheetStatus: 'submitted', hoursThisWeek: 40 },
  { id: 10, name: 'Clara Martinez', role: 'Data Scientist', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100', email: 'clara.martinez@kokbif.com', level: 8, xp: 1450, streak: 7, project: 'SES - ML', status: 'active', timesheetStatus: 'submitted', hoursThisWeek: 38 },
  { id: 11, name: 'Antoine Leroy', role: 'Architecte', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100', email: 'antoine.leroy@kokbif.com', level: 18, xp: 4200, streak: 60, project: 'Clearstream - Archi', status: 'active', timesheetStatus: 'approved', hoursThisWeek: 45 },
  { id: 12, name: 'Léa Petit', role: 'Scrum Master', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100', email: 'lea.petit@kokbif.com', level: 14, xp: 2980, streak: 18, project: 'BGL - Agile', status: 'active', timesheetStatus: 'submitted', hoursThisWeek: 40 },
  { id: 13, name: 'Hugo Moreau', role: 'Security', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100', email: 'hugo.moreau@kokbif.com', level: 15, xp: 3150, streak: 25, project: 'BCEE - Security', status: 'active', timesheetStatus: 'approved', hoursThisWeek: 40 },
]

// ============================================
// PROJETS
// ============================================
const projects = [
  { id: 'bgl-sprint', name: 'BGL - Sprint 12', client: 'BGL BNP Paribas', color: 'blue', budget: 450, spent: 320 },
  { id: 'bgl-support', name: 'BGL - Support', client: 'BGL BNP Paribas', color: 'blue', budget: 200, spent: 145 },
  { id: 'post-migration', name: 'POST - Migration', client: 'POST Luxembourg', color: 'emerald', budget: 380, spent: 290 },
  { id: 'post-mobile', name: 'POST - Mobile', client: 'POST Luxembourg', color: 'emerald', budget: 280, spent: 180 },
  { id: 'ses-analytics', name: 'SES - Analytics', client: 'SES', color: 'violet', budget: 320, spent: 240 },
  { id: 'clearstream-si', name: 'Clearstream - SI', client: 'Clearstream', color: 'amber', budget: 650, spent: 520 },
  { id: 'bcee-security', name: 'BCEE - Security', client: 'Spuerkeess', color: 'rose', budget: 280, spent: 195 },
  { id: 'internal-formation', name: 'Internal - Formation', client: 'Kokbif', color: 'gray', budget: 100, spent: 45 },
  { id: 'internal-meeting', name: 'Internal - Meeting', client: 'Kokbif', color: 'gray', budget: 50, spent: 30 },
]

// ============================================
// GÉNÉRATION TIMESHEETS DYNAMIQUES
// ============================================
const generateTimesheets = () => {
  const today = new Date()
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 1 })
  const timesheets = {}
  
  for (let week = 5; week >= 0; week--) {
    const weekStart = subWeeks(currentWeekStart, week)
    for (let day = 0; day < 5; day++) {
      const date = format(addDays(weekStart, day), 'yyyy-MM-dd')
      const dayDate = addDays(weekStart, day)
      
      if (week === 0 && dayDate > today) continue
      
      const projectOptions = [
        [{ projectId: 'bgl-sprint', hours: 8 }],
        [{ projectId: 'bgl-sprint', hours: 6 }, { projectId: 'internal-meeting', hours: 2 }],
        [{ projectId: 'bgl-sprint', hours: 4 }, { projectId: 'bgl-support', hours: 4 }],
        [{ projectId: 'bgl-sprint', hours: 7 }, { projectId: 'internal-formation', hours: 1 }],
      ]
      
      const entries = projectOptions[(week + day) % projectOptions.length]
      const hours = entries.reduce((s, e) => s + e.hours, 0)
      
      let status = 'approved'
      if (week === 0) status = 'draft'
      else if (week === 1) status = 'submitted'
      
      timesheets[date] = { hours, entries, status, note: day === 2 && week < 2 ? 'Réunion client' : '' }
    }
  }
  return timesheets
}

// ============================================
// CONGÉS
// ============================================
const generateLeaves = () => {
  const today = new Date()
  return [
    { id: 1, type: 'Congé payé', typeId: 'paid', startDate: format(addDays(today, 30), 'yyyy-MM-dd'), endDate: format(addDays(today, 35), 'yyyy-MM-dd'), days: 5, status: 'approved', reason: 'Vacances', userId: 2 },
    { id: 2, type: 'RTT', typeId: 'rtt', startDate: format(addDays(today, 10), 'yyyy-MM-dd'), endDate: format(addDays(today, 10), 'yyyy-MM-dd'), days: 1, status: 'pending', reason: 'RDV médical', userId: 2 },
  ]
}

const generateTeamLeaves = () => {
  const today = new Date()
  return [
    { id: 't1', memberId: 8, name: 'Sophie Chen', type: 'paid', start: format(subDays(today, 1), 'yyyy-MM-dd'), end: format(addDays(today, 2), 'yyyy-MM-dd'), color: 'emerald' },
    { id: 't2', memberId: 4, name: 'Julie Martin', type: 'rtt', start: format(addDays(today, 5), 'yyyy-MM-dd'), end: format(addDays(today, 5), 'yyyy-MM-dd'), color: 'blue' },
    { id: 't3', memberId: 3, name: 'Marie Dupont', type: 'paid', start: format(addDays(today, 7), 'yyyy-MM-dd'), end: format(addDays(today, 11), 'yyyy-MM-dd'), color: 'emerald' },
    { id: 't4', memberId: 11, name: 'Antoine Leroy', type: 'paid', start: format(addDays(today, 14), 'yyyy-MM-dd'), end: format(addDays(today, 18), 'yyyy-MM-dd'), color: 'emerald' },
    { id: 't5', memberId: 9, name: 'Pierre Durand', type: 'rtt', start: format(addDays(today, 3), 'yyyy-MM-dd'), end: format(addDays(today, 3), 'yyyy-MM-dd'), color: 'blue' },
  ]
}

// ============================================
// APPROBATIONS
// ============================================
const generateApprovals = () => {
  const weekNum = getISOWeek(new Date())
  return [
    { id: 101, type: 'timesheet', user: teamMembers[1], period: `Semaine ${weekNum - 1}`, hours: 40, details: { lun: 8, mar: 8, mer: 8, jeu: 8, ven: 8 }, submittedAt: 'Il y a 2h', status: 'pending', notes: 'POST - Migration' },
    { id: 102, type: 'leave', user: teamMembers[2], period: '10-12 Février', days: 3, leaveType: 'RTT', submittedAt: 'Hier', status: 'pending', notes: 'Long week-end' },
    { id: 103, type: 'timesheet', user: teamMembers[7], period: `Semaine ${weekNum - 1}`, hours: 40, details: { lun: 8, mar: 8, mer: 8, jeu: 8, ven: 8 }, submittedAt: 'Il y a 5h', status: 'pending', notes: 'Deloitte - SAP' },
    { id: 104, type: 'leave', user: teamMembers[8], period: '20-24 Février', days: 5, leaveType: 'Congé payé', submittedAt: 'Il y a 1j', status: 'pending', notes: 'Vacances' },
    { id: 105, type: 'timesheet', user: teamMembers[10], period: `Semaine ${weekNum - 1}`, hours: 40, details: { lun: 8, mar: 8, mer: 8, jeu: 8, ven: 8 }, submittedAt: 'Il y a 3h', status: 'pending', notes: 'BGL - Agile' },
  ]
}

// ============================================
// PROVIDER
// ============================================
export function AppProvider({ children }) {
  const [timesheets, setTimesheets] = useState(generateTimesheets)
  const [leaveRequests, setLeaveRequests] = useState(generateLeaves)
  const [leaveBalance, setLeaveBalance] = useState({ paid: 18, paidTotal: 26, rtt: 5, rttTotal: 10 })
  const [pendingApprovals, setPendingApprovals] = useState(generateApprovals)
  const [teamLeaves] = useState(generateTeamLeaves)
  const [team] = useState(teamMembers)
  
  const [notifications, setNotifications] = useState({
    manager: [
      { id: 'm1', type: 'info', title: 'Nouveau timesheet', message: 'Marie Dupont a soumis S03', read: false, createdAt: new Date(Date.now() - 7200000), link: '/app/manager/approvals' },
      { id: 'm2', type: 'warning', title: 'Retard', message: 'Lucas Bernard: 5 jours de retard', read: false, createdAt: new Date(Date.now() - 86400000), link: '/app/manager/team' },
    ],
    consultant: [
      { id: 'c1', type: 'success', title: 'Approuvé', message: 'Semaine 02 validée', read: true, createdAt: new Date(Date.now() - 86400000), link: '/app/consultant/timesheet' },
      { id: 'c2', type: 'info', title: 'Rappel', message: 'Soumettez avant vendredi', read: false, createdAt: new Date(Date.now() - 3600000), link: '/app/consultant/timesheet' },
    ],
  })
  
  const [toasts, setToasts] = useState([])
  const [newNotification, setNewNotification] = useState({ manager: false, consultant: false })

  const stats = useMemo(() => ({
    activeConsultants: team.filter(m => m.status !== 'leave').length,
    lateConsultants: team.filter(m => m.status === 'late'),
    onLeave: team.filter(m => m.status === 'leave'),
    pendingCount: pendingApprovals.filter(a => a.status === 'pending').length,
    approvedThisMonth: Math.round((team.filter(m => m.timesheetStatus === 'approved').length / team.length) * 100),
    totalTeam: team.length,
  }), [team, pendingApprovals])

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), [])

  const addNotification = useCallback((role, notification) => {
    const notif = { id: Date.now(), ...notification, read: false, createdAt: new Date() }
    setNotifications(prev => ({ ...prev, [role]: [notif, ...prev[role]] }))
    setNewNotification(prev => ({ ...prev, [role]: true }))
    setTimeout(() => setNewNotification(prev => ({ ...prev, [role]: false })), 3000)
  }, [])

  const markAsRead = useCallback((role, id) => {
    setNotifications(prev => ({ ...prev, [role]: prev[role].map(n => n.id === id ? { ...n, read: true } : n) }))
  }, [])

  const markAllAsRead = useCallback((role) => {
    setNotifications(prev => ({ ...prev, [role]: prev[role].map(n => ({ ...n, read: true })) }))
  }, [])

  const getUnreadCount = useCallback((role) => notifications[role]?.filter(n => !n.read).length || 0, [notifications])

  const updateTimesheet = useCallback((date, data) => {
    setTimesheets(prev => ({ ...prev, [date]: { ...prev[date], ...data, status: 'draft' } }))
    addToast('Heures enregistrées', 'success')
  }, [addToast])

  const submitWeek = useCallback((weekDates, weekNumber) => {
    const totalHours = weekDates.reduce((sum, d) => {
      const ts = timesheets[d]
      return sum + (ts?.entries ? ts.entries.reduce((s, e) => s + e.hours, 0) : (ts?.hours || 0))
    }, 0)
    
    if (totalHours === 0) {
      addToast('Saisissez vos heures avant de soumettre', 'warning')
      return false
    }
    
    setTimesheets(prev => {
      const updated = { ...prev }
      weekDates.forEach(d => { if (updated[d]) updated[d] = { ...updated[d], status: 'submitted' } })
      return updated
    })

    setPendingApprovals(prev => [{
      id: Date.now(),
      type: 'timesheet',
      user: { id: users.consultant.id, name: users.consultant.fullName, avatar: users.consultant.avatar, role: users.consultant.role },
      period: `Semaine ${String(weekNumber).padStart(2, '0')}`,
      hours: totalHours,
      submittedAt: "À l'instant",
      status: 'pending',
      weekDates,
    }, ...prev])

    addNotification('manager', {
      type: 'info',
      title: 'Nouveau timesheet',
      message: `${users.consultant.fullName} - S${weekNumber} (${totalHours}h)`,
      link: '/app/manager/approvals',
    })

    addToast('Semaine soumise ! +25 XP 🎉', 'success')
    return true
  }, [timesheets, addNotification, addToast])

  const addLeaveRequest = useCallback((request) => {
    if (!request.startDate || !request.endDate) {
      addToast('Sélectionnez des dates', 'warning')
      return false
    }
    
    const newReq = { ...request, id: Date.now(), status: 'pending', userId: 2 }
    setLeaveRequests(prev => [newReq, ...prev])
    setPendingApprovals(prev => [{
      id: Date.now() + 1,
      type: 'leave',
      user: { id: 2, name: users.consultant.fullName, avatar: users.consultant.avatar, role: users.consultant.role },
      period: `${request.startDate} - ${request.endDate}`,
      days: request.days,
      leaveType: request.type,
      submittedAt: "À l'instant",
      status: 'pending',
      leaveRequestId: newReq.id,
    }, ...prev])

    addNotification('manager', { type: 'info', title: 'Demande congé', message: `${users.consultant.fullName}: ${request.days}j`, link: '/app/manager/approvals' })
    addToast('Demande soumise !', 'success')
    return true
  }, [addNotification, addToast])

  const cancelLeaveRequest = useCallback((id) => {
    setLeaveRequests(prev => prev.filter(r => r.id !== id))
    setPendingApprovals(prev => prev.filter(a => a.leaveRequestId !== id))
    addToast('Demande annulée', 'info')
  }, [addToast])

  const approveItem = useCallback((id) => {
    const item = pendingApprovals.find(a => a.id === id)
    if (!item) return

    setTimeout(() => setPendingApprovals(prev => prev.filter(a => a.id !== id)), 300)

    if (item.user.id === 2) {
      if (item.type === 'timesheet' && item.weekDates) {
        setTimesheets(prev => {
          const updated = { ...prev }
          item.weekDates.forEach(d => { if (updated[d]) updated[d] = { ...updated[d], status: 'approved' } })
          return updated
        })
      } else if (item.leaveRequestId) {
        setLeaveRequests(prev => prev.map(r => r.id === item.leaveRequestId ? { ...r, status: 'approved' } : r))
        if (item.leaveType === 'Congé payé') setLeaveBalance(prev => ({ ...prev, paid: prev.paid - item.days }))
        else if (item.leaveType === 'RTT') setLeaveBalance(prev => ({ ...prev, rtt: prev.rtt - item.days }))
      }
      addNotification('consultant', { type: 'success', title: 'Approuvé ✓', message: `${users.manager.fullName} a validé`, link: item.type === 'timesheet' ? '/app/consultant/timesheet' : '/app/consultant/leave' })
    }
    addToast('Approuvé ✓', 'success')
  }, [pendingApprovals, addNotification, addToast])

  const rejectItem = useCallback((id, reason) => {
    if (!reason?.trim()) { addToast('Indiquez un motif', 'warning'); return }
    const item = pendingApprovals.find(a => a.id === id)
    if (!item) return

    setPendingApprovals(prev => prev.filter(a => a.id !== id))

    if (item.user.id === 2) {
      if (item.type === 'timesheet' && item.weekDates) {
        setTimesheets(prev => {
          const updated = { ...prev }
          item.weekDates.forEach(d => { if (updated[d]) updated[d] = { ...updated[d], status: 'rejected', rejectReason: reason } })
          return updated
        })
      } else if (item.leaveRequestId) {
        setLeaveRequests(prev => prev.map(r => r.id === item.leaveRequestId ? { ...r, status: 'rejected', rejectReason: reason } : r))
      }
      addNotification('consultant', { type: 'error', title: 'Refusé', message: reason, link: item.type === 'timesheet' ? '/app/consultant/timesheet' : '/app/consultant/leave' })
    }
    addToast('Refusé', 'error')
  }, [pendingApprovals, addNotification, addToast])

  const approveAll = useCallback(() => {
    pendingApprovals.filter(a => a.status === 'pending').forEach(a => approveItem(a.id))
  }, [pendingApprovals, approveItem])

  const getPendingCount = useCallback(() => pendingApprovals.filter(a => a.status === 'pending').length, [pendingApprovals])

  const sendReminder = useCallback((memberId) => {
    const member = team.find(m => m.id === memberId)
    if (member) addToast(`Rappel envoyé à ${member.name}`, 'success')
  }, [team, addToast])

  return (
    <AppContext.Provider value={{
      users, team, projects, stats, timesheets, leaveRequests, leaveBalance, pendingApprovals, teamLeaves,
      updateTimesheet, submitWeek, addLeaveRequest, cancelLeaveRequest,
      approveItem, rejectItem, approveAll, getPendingCount,
      notifications, addNotification, markAsRead, markAllAsRead, getUnreadCount, newNotification,
      toasts, addToast, removeToast, sendReminder,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}

export default AppContext
