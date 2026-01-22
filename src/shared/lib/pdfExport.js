// Service pour générer les CRA (Compte Rendu d'Activité) en PDF
// Utilise la génération HTML → impression/PDF natif du navigateur

export function generateCRAHTML(data) {
  const {
    consultant,
    weekNumber,
    year,
    period,
    entries,
    totalHours,
    projects,
    submittedAt,
    status
  } = data

  const projectSummary = projects.map(p => `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${p.name}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: center;">${p.client}</td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${p.hours}h</td>
    </tr>
  `).join('')

  const dailyEntries = entries.map(e => `
    <tr>
      <td style="padding: 10px 16px; border-bottom: 1px solid #f3f4f6;">${e.day}</td>
      <td style="padding: 10px 16px; border-bottom: 1px solid #f3f4f6;">${e.date}</td>
      <td style="padding: 10px 16px; border-bottom: 1px solid #f3f4f6;">${e.projects.join(', ')}</td>
      <td style="padding: 10px 16px; border-bottom: 1px solid #f3f4f6; text-align: right; font-weight: 500;">${e.hours}h</td>
      <td style="padding: 10px 16px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 12px;">${e.note || '-'}</td>
    </tr>
  `).join('')

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CRA S${weekNumber} - ${consultant.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      color: #1f2937; 
      line-height: 1.5;
      padding: 40px;
      background: white;
    }
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start; 
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f59e0b;
    }
    .logo { 
      font-size: 28px; 
      font-weight: 700; 
      color: #f59e0b;
    }
    .logo span { color: #1f2937; }
    .doc-info { text-align: right; }
    .doc-title { font-size: 20px; font-weight: 600; color: #374151; }
    .doc-subtitle { font-size: 14px; color: #6b7280; margin-top: 4px; }
    .section { margin-bottom: 32px; }
    .section-title { 
      font-size: 14px; 
      font-weight: 600; 
      color: #6b7280; 
      text-transform: uppercase; 
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .info-item { background: #f9fafb; padding: 16px; border-radius: 8px; }
    .info-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
    .info-value { font-size: 16px; font-weight: 600; color: #1f2937; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th { 
      background: #1f2937; 
      color: white; 
      padding: 14px 16px; 
      text-align: left; 
      font-weight: 600; 
      font-size: 13px;
    }
    th:last-child { text-align: right; }
    .total-row { background: #fef3c7; }
    .total-row td { font-weight: 700; color: #92400e; }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .status-submitted { background: #fef3c7; color: #92400e; }
    .status-approved { background: #d1fae5; color: #065f46; }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #9ca3af;
    }
    .signature-section {
      margin-top: 40px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
    }
    .signature-box {
      border: 1px dashed #d1d5db;
      border-radius: 8px;
      padding: 20px;
      min-height: 100px;
    }
    .signature-label { font-size: 12px; color: #6b7280; margin-bottom: 8px; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Kok<span>bif</span></div>
      <p style="font-size: 12px; color: #6b7280; margin-top: 4px;">Compte Rendu d'Activité</p>
    </div>
    <div class="doc-info">
      <div class="doc-title">Semaine ${weekNumber}</div>
      <div class="doc-subtitle">${period}</div>
      <div style="margin-top: 8px;">
        <span class="status-badge ${status === 'approved' ? 'status-approved' : 'status-submitted'}">
          ${status === 'approved' ? '✓ Approuvé' : '⏳ Soumis'}
        </span>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Informations consultant</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Nom complet</div>
        <div class="info-value">${consultant.name}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Email</div>
        <div class="info-value">${consultant.email}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Département</div>
        <div class="info-value">${consultant.department || 'IT Consulting'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Manager</div>
        <div class="info-value">${consultant.manager || 'Korian Dupont'}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Récapitulatif par projet</div>
    <table>
      <thead>
        <tr>
          <th>Projet</th>
          <th style="text-align: center;">Client</th>
          <th style="text-align: right;">Heures</th>
        </tr>
      </thead>
      <tbody>
        ${projectSummary}
        <tr class="total-row">
          <td style="padding: 14px 16px; font-weight: 700;" colspan="2">Total</td>
          <td style="padding: 14px 16px; text-align: right; font-weight: 700; font-size: 18px;">${totalHours}h</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Détail journalier</div>
    <table>
      <thead>
        <tr>
          <th>Jour</th>
          <th>Date</th>
          <th>Projet(s)</th>
          <th style="text-align: right;">Heures</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        ${dailyEntries}
      </tbody>
    </table>
  </div>

  <div class="signature-section">
    <div class="signature-box">
      <div class="signature-label">Signature Consultant</div>
      <div style="margin-top: 40px; border-top: 1px solid #d1d5db; padding-top: 8px;">
        <span style="font-size: 12px; color: #9ca3af;">Date : _______________</span>
      </div>
    </div>
    <div class="signature-box">
      <div class="signature-label">Signature Manager</div>
      <div style="margin-top: 40px; border-top: 1px solid #d1d5db; padding-top: 8px;">
        <span style="font-size: 12px; color: #9ca3af;">Date : _______________</span>
      </div>
    </div>
  </div>

  <div class="footer">
    <div>Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
    <div>Kokbif © ${year} - Document confidentiel</div>
  </div>

  <script class="no-print">
    // Auto print on load
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    }
  </script>
</body>
</html>
`
}

export function exportCRA(timesheets, weekDates, weekNumber, user) {
  const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
  const PROJECTS_MAP = {
    'bgl-sprint': { name: 'BGL - Sprint 12', client: 'BGL BNP Paribas' },
    'bgl-support': { name: 'BGL - Support', client: 'BGL BNP Paribas' },
    'post-migration': { name: 'POST - Migration', client: 'POST Luxembourg' },
    'internal-formation': { name: 'Internal - Formation', client: 'Kokbif' },
    'internal-meeting': { name: 'Internal - Meeting', client: 'Kokbif' },
  }

  // Calculer les entrées journalières
  const entries = weekDates.map((dateStr, i) => {
    const data = timesheets[dateStr]
    const date = new Date(dateStr)
    
    if (!data) {
      return {
        day: DAYS[i],
        date: date.toLocaleDateString('fr-FR'),
        projects: ['-'],
        hours: 0,
        note: ''
      }
    }
    
    const projectNames = data.entries 
      ? data.entries.map(e => PROJECTS_MAP[e.projectId]?.name || e.projectId)
      : [data.project || 'Non spécifié']
    
    const totalHours = data.entries
      ? data.entries.reduce((sum, e) => sum + e.hours, 0)
      : data.hours || 0
    
    return {
      day: DAYS[i],
      date: date.toLocaleDateString('fr-FR'),
      projects: projectNames,
      hours: totalHours,
      note: data.note || ''
    }
  })

  // Calculer le récap par projet
  const projectHours = {}
  weekDates.forEach(dateStr => {
    const data = timesheets[dateStr]
    if (data?.entries) {
      data.entries.forEach(e => {
        const proj = PROJECTS_MAP[e.projectId] || { name: e.projectId, client: 'Inconnu' }
        if (!projectHours[e.projectId]) {
          projectHours[e.projectId] = { ...proj, hours: 0 }
        }
        projectHours[e.projectId].hours += e.hours
      })
    } else if (data) {
      const projId = Object.keys(PROJECTS_MAP).find(k => PROJECTS_MAP[k].name === data.project) || 'other'
      if (!projectHours[projId]) {
        projectHours[projId] = { name: data.project || 'Autre', client: 'Non spécifié', hours: 0 }
      }
      projectHours[projId].hours += data.hours || 0
    }
  })

  const projects = Object.values(projectHours).filter(p => p.hours > 0)
  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0)

  // Générer la période
  const startDate = new Date(weekDates[0])
  const endDate = new Date(weekDates[4])
  const period = `${startDate.toLocaleDateString('fr-FR')} - ${endDate.toLocaleDateString('fr-FR')}`

  // Générer le HTML
  const html = generateCRAHTML({
    consultant: {
      name: user?.fullName || 'Consultant',
      email: user?.email || 'consultant@kokbif.com',
      department: 'IT Consulting',
      manager: 'Korian Dupont'
    },
    weekNumber: String(weekNumber).padStart(2, '0'),
    year: startDate.getFullYear(),
    period,
    entries,
    totalHours,
    projects,
    status: 'submitted'
  })

  // Ouvrir dans une nouvelle fenêtre pour impression
  const printWindow = window.open('', '_blank')
  printWindow.document.write(html)
  printWindow.document.close()
}

export default { generateCRAHTML, exportCRA }
