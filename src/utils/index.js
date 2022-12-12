const { date } = require('quasar')
const projectNameMapping = [
  {
    displayName: 'Business Requirements',
    scrumNameForRapidView: 'Business Requirements-SCRUM',
    kanbanNameForRapidView: 'Business Requirements-KANBAN'
  },
  {
    displayName: 'Internal Requirements',
    scrumNameForRapidView: 'Internal Requirements-SCRUM',
    kanbanNameForRapidView: 'Internal Requirements-KANBAN'
  },
  {
    displayName: 'Small Changes – Team Agile',
    scrumNameForRapidView: 'SmallChanges - SCRUM',
    kanbanNameForRapidView: 'SmallChanges - KANBAN'
  }
]

const STATUS_MAPPING = [
  {
    name: 'QA/E2E OK/Implemented',
    borderColor: '#31CCEC',
    color: 'rgba(54, 162, 235, 0.2)',
    statusList: ['Quality Assurance', 'Test E2E OK', 'Implemented', 'Done']
  },
  {
    name: 'Other',
    borderColor: 'darkorange',
    color: 'rgba(255, 159, 64, 0.2)',
    statusList: ['In Progress', 'Validated', 'Open', 'To Do', 'Proposed', 'Analyzed', 'Verified Without Test', 'Testing', 'Documenting', 'Developed', 'Test E2E KO']
  },
  {
    name: 'Closed/Released',
    borderColor: '#21BA45',
    color: 'rgba(75, 192, 192, 0.2)',
    statusList: ['Released', 'Closed']
  },
  {
    name: 'Pending',
    borderColor: '#FCD037',
    color: 'rgba(255, 205, 86, 0.2)',
    statusList: ['Pending Clarification', 'Pending Business Clarification', 'Blocked']
  },
  {
    name: 'Rejected',
    borderColor: 'dimgrey',
    color: 'rgba(201, 203, 207, 0.2)',
    statusList: ['Rejected']
  }
]

exports.statusLabel = ['QA/E2E OK/Implemented', 'Other', 'Closed/Released', 'Pending', 'Rejected']

exports.VIEW_SCRUM = true

exports.DELOITTE_TEAM = [
  'Dario Cascone',
  'Giuseppe Ciaravolo',
  'Giovanni Gamba',
  'Gennaro Casola',
  'Fedele Mauro',
  'Riccardo Parente'
]

exports.getStatusChartData = (labels, issues, isGlobalPercentage) => {
  const issueStatusList = this.getIssueStatusList(issues)
  const data = []
  const counts = {}
  for (const label of labels) {
    const { statusList } = STATUS_MAPPING.find(s => s.name === label)
    if (statusList && statusList.length > 0) {
      for (const status of statusList) {
        let s = []
        if (!isGlobalPercentage) {
          s = issueStatusList.filter(is => is === status)
        } else {
          s = issueStatusList.filter((is) => {
            return is === status && is !== 'Rejected' && is !== 'Pending Clarification' && is !== 'Pending Business Clarification' && is !== 'Blocked'
          })
        }
        counts[label] = counts[label] ? counts[label] + s.length : s.length
      }
    }
  }
  for (const count of Object.keys(counts)) {
    data.push(counts[count])
  }
  return data
}

exports.getTeamChartData = (labels, issues, isAgileSprint) => {
  const data = []
  const counts = {}
  if (isAgileSprint) {
    for (const issue of issues) {
      if (this.DELOITTE_TEAM.includes(issue.fields.assignee.displayName)) {
        counts.deloitte = counts.deloitte ? counts.deloitte + 1 : 1
      } else {
        counts.skylogic = counts.skylogic ? counts.skylogic + 1 : 1
      }
    }
  } else {
    for (const issue of issues) {
      if (issue.fields.customfield_10602 && issue.fields.customfield_10602.length > 0) {
        for (const field of issue.fields.customfield_10602) {
          if (field.id === '10414') {
            counts.agile = counts.agile ? counts.agile + 1 : 1
          } else if (field.id === '10405') {
            counts.emi = counts.emi ? counts.emi + 1 : 1
          }
        }
      }
    }
  }
  for (const count of Object.keys(counts)) {
    data.push(counts[count])
  }
  return data
}

exports.getGlobalPercentage = (data, issues) => {
  let globalPercentage = 0
  const issueForPercentage = data.reduce((acc, item) => {
    acc += item
    return acc
  }, 0)
  globalPercentage += Math.round((issueForPercentage * 100) / issues.length * 10) / 10
  return globalPercentage
}

exports.getBusinessDatesCount = (startDate, endDate) => {
  startDate.setHours(0, 0, 0, 0)
  endDate.setHours(0, 0, 0, 0)
  let count = 0
  let curDate = +startDate
  while (curDate <= +endDate) {
    const dayOfWeek = new Date(curDate).getDay()
    const isWeekend = (dayOfWeek === 6) || (dayOfWeek === 0)
    if (!isWeekend) {
      count++
    }
    curDate = curDate + 24 * 60 * 60 * 1000
  }
  return count - 1
}

exports.getFormattedDate = (sprintDate, format) => {
  const d = new Date(sprintDate)
  return date.formatDate(d, format)
}

exports.getProjectNameForRapidViewRequest = (projectName) => {
  return projectNameMapping.find(p => p.displayName === projectName)
}

exports.getIssueStatusList = (issues) => {
  const issueStatusList = issues.reduce((acc, issue) => {
    acc.push(issue.fields.status.name)
    return acc
  }, [])
  return issueStatusList
}

exports.getBackgroundColorChart = (labels) => {
  const backgroundColor = []
  for (const label of labels) {
    const { color } = STATUS_MAPPING.find(s => s.name === label)
    backgroundColor.push(color)
  }
  return backgroundColor
}

exports.getBackgroundBorderColorChart = (labels) => {
  const backgroundBorderColor = []
  for (const label of labels) {
    const { borderColor } = STATUS_MAPPING.find(s => s.name === label)
    backgroundBorderColor.push(borderColor)
  }
  return backgroundBorderColor
}

exports.getStatusTableColor = (status) => {
  const { borderColor } = STATUS_MAPPING.find(s => s.statusList.includes(status))
  return {
    color: borderColor
  }
}

exports.getStatusLabelWithPercentage = (labels, data) => {
  const totalBr = data.reduce((acc, item) => {
    acc += item
    return acc
  }, 0)
  const labelsCopy = [...labels]
  for (const [index, l] of data.entries()) {
    labelsCopy[index] += ' [' + Math.round((l * 100) / totalBr * 10) / 10 + '%]'
  }
  return labelsCopy
}

exports.barChartStatusOptions = {
  indexAxis: 'y',
  plugins: {
    legend: {
      display: false,
      position: 'top',
      padding: '10px',
      align: 'start',
      labels: {
        usePointStyle: false,
        pointStyle: 'circle'
      }
    },
    dataLabels: {
      display: true
    }
  }
}

exports.barChartTeamOptions = {
  indexAxis: 'x',
  plugins: {
    legend: {
      display: false
    }
  }
}
