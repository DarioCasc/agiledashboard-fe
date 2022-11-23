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

const statusMapping = [
  {
    name: 'Implemented',
    color: '#31CCEC',
    statusList: ['Quality Assurance', 'Test E2E OK', 'Implemented', 'Done']
  },
  {
    name: 'Developments on going',
    color: '#FCD037',
    statusList: ['In Progress', 'Validated', 'Open', 'To Do', 'Proposed', 'Analyzed', 'Verified Without Test', 'Testing', 'Documenting', 'Developed']
  },
  {
    name: 'Completed',
    color: '#21BA45',
    statusList: ['Released', 'Closed']
  },
  {
    name: 'Blocked',
    color: 'darkorange',
    statusList: ['Pending Clarification', 'Test E2E KO', 'Pending Business Clarification', 'Blocked']
  },
  {
    name: 'Rejected',
    color: 'dimgrey',
    statusList: ['Rejected']
  }
]

exports.statusLabel = ['Implemented', 'Developments on going', 'Completed', 'Blocked', 'Rejected']

exports.VIEW_SCRUM = true

exports.DELOITTE_TEAM = [
  'Dario Cascone',
  'Giuseppe Ciaravolo',
  'Giovanni Gamba',
  'Gennaro Casola',
  'Fedele Mauro',
  'Riccardo Parente'
]

exports.getStatusChartData = (labels, issues) => {
  const issueStatusList = this.getIssueStatusList(issues)
  const data = []
  const counts = {}
  for (const label of labels) {
    const { statusList } = statusMapping.find(s => s.name === label)
    if (statusList && statusList.length > 0) {
      for (const status of statusList) {
        const s = issueStatusList.filter(is => is === status)
        counts[label] = counts[label] ? counts[label] + s.length : s.length
      }
    }
  }
  for (const count of Object.keys(counts)) {
    data.push(counts[count])
  }
  return data
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

exports.getFormattedDate = (sprintDate) => {
  const d = new Date(sprintDate)
  return date.formatDate(d, 'DD-MM-YYYY')
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
    const { color } = statusMapping.find(s => s.name === label)
    backgroundColor.push(color)
  }
  return backgroundColor
}

exports.doughnutChartOptions = {
  plugins: {
    legend: {
      display: true,
      position: 'left',
      padding: 0,
      align: 'center',
      labels: {
        usePointStyle: false,
        pointStyle: 'circle'
      }
    }
  }
}
