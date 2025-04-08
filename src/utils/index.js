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
    scrumNameForRapidView: 'Small Changes-Scrum',
    kanbanNameForRapidView: 'SmallChanges - KANBAN'
  }
]

const STATUS_MAPPING = [
  {
    name: 'QA/E2E OK/Implemented',
    borderColor: '#31CCEC',
    color: 'rgba(54, 162, 235, 0.2)',
    statusList: ['Quality Assurance', 'Test E2E OK', 'Implemented', 'Done', 'Implemented (migrated 3)', 'Implemented (migrated 2)', 'Implemented (migrated 1)'],
    order: 2
  },
  {
    name: 'Other',
    borderColor: 'darkorange',
    color: 'rgba(255, 159, 64, 0.2)',
    statusList: ['In Progress', 'Validated', 'Open', 'To Do', 'Proposed', 'Verified Without Test', 'Testing', 'Documenting', 'Developed', 'Test E2E KO', 'Validated (migrated)'],
    order: 4
  },
  {
    name: 'Closed/Released',
    borderColor: '#21BA45',
    color: 'rgba(75, 192, 192, 0.2)',
    statusList: ['Released', 'Closed', 'Released (migrated)'],
    order: 1
  },
  {
    name: 'Pending',
    borderColor: '#FCD037',
    color: 'rgba(255, 205, 86, 0.2)',
    statusList: ['Pending Clarification', 'Pending Business Clarification', 'Blocked'],
    order: 3
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

exports.getStatusChartData = (labels, issues, isGlobalPercentage, isSprintClosed = false) => {
  const issueStatusList = this.getIssueStatusList(issues)
  console.log('issueStatusList: ', issueStatusList)
  const data = {}
  for (const label of labels) {
    const { statusList } = STATUS_MAPPING.find(s => s.name === label)
    if (statusList && statusList.length > 0) {
      for (const status of statusList) {
        let s = []
        if (!isGlobalPercentage && !isSprintClosed) {
          s = issueStatusList.filter(is => is === status)
        } else if (isGlobalPercentage) {
          s = issueStatusList.filter((is) => {
            return is === status && is !== 'Rejected' && is !== 'Pending Clarification' && is !== 'Pending Business Clarification' && is !== 'Blocked'
          })
        } else if (isSprintClosed) {
          s = issueStatusList.filter((is) => {
            return is === status && (is === 'Released' || is === 'Released (migrated)' || is === 'Closed' || is === 'Rejected')
          })
        }
        data[label] = data[label] ? data[label] + s.length : s.length
      }
    }
  }
  return data
}

exports.getTeamChartData = (labels, issues, isAgileSprint) => {
  const data = []
  const counts = {}
  if (isAgileSprint) {
    for (const issue of issues) {
      if (issue.fields.assignee) {
        if (this.DELOITTE_TEAM.includes(issue.fields.assignee.displayName)) {
          counts.deloitte = counts.deloitte ? counts.deloitte + 1 : 1
        } else {
          counts.skylogic = counts.skylogic ? counts.skylogic + 1 : 1
        }
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
  if (counts.agile) {
    data.push(counts.agile)
  }
  if (counts.emi) {
    data.push(counts.emi)
  }
  if (counts.deloitte) {
    data.push(counts.deloitte)
  }
  if (counts.skylogic) {
    data.push(counts.skylogic)
  }
  return data
}

exports.getGlobalPercentage = (data, issues) => {
  let globalPercentage = 0
  console.log('getGlobalPercentage: ', data)
  const issueForPercentage = Object.values(data).reduce((acc, item) => {
    acc += item
    return acc
  }, 0)
  console.log('issueForPercentage: ', issueForPercentage)
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

exports.getBackgroundColorChart = (label) => {
  const { color } = STATUS_MAPPING.find(s => s.name === label)
  return color
}

exports.getBackgroundBorderColorChart = (label) => {
  const { borderColor } = STATUS_MAPPING.find(s => s.name === label)
  return borderColor
}

exports.getOrderChart = (label) => {
  const { order } = STATUS_MAPPING.find(s => s.name === label)
  return order
}

exports.getStatusTableColor = (status) => {
  const mapping = STATUS_MAPPING.find(s => s.statusList.includes(status))
  if (!mapping) {
    console.log(`Status non gestito: "${status}"`)
    return {}
  }
  return { color: mapping.borderColor }
}

exports.getStatusLabelWithPercentage = (labels, data) => {
  const totalBr = Object.values(data).reduce((acc, item) => {
    acc += item
    return acc
  }, 0)
  const labelsCopy = [...labels]
  for (const [index, l] of Object.values(data).entries()) {
    labelsCopy[index] += ' [' + Math.round((l * 100) / totalBr * 10) / 10 + '%]'
  }
  return labelsCopy
}

exports.getStatusLabelWithOnlyPercentage = (key, data) => {
  const totalBr = Object.values(data).reduce((acc, item) => {
    acc += item
    return acc
  }, 0)
  return Math.round((data[key] * 100) / totalBr * 10) / 10
}

exports.isBusinessPlatforms = (arr) => {
  return arr.some((el) => {
    return el.id === '14158'
  })
}

exports.isTechnicalPlatforms = (arr) => {
  return arr.some((el) => {
    return el.id === '14159'
  })
}

exports.barChartStatusOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 2000, // Durata dell'animazione in millisecondi
    easing: 'easeOutQuart' // Tipo di easing per l'animazione
  },
  scales: {
    x: {
      display: false,
      stacked: true
    },
    y: {
      display: false,
      stacked: true
    }
  },
  plugins: {
    legend: {
      display: true,
      position: 'right'
    },
    datalabels: {
      color: 'white',
      display: function (context) {
        return context.dataset.data[context.dataIndex]
      },
      font: {
        weight: 'bold'
      },
      formatter: function (item, context) {
        return context.dataset.percentage[context.dataIndex] + '%'
      },
      align: 'center', // Centra orizzontalmente
      anchor: 'center' // Centra verticalmente
    }
  }
}

exports.barChartStoryPointOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 2000, // Durata dell'animazione in millisecondi
    easing: 'easeOutQuart' // Tipo di easing per l'animazione
  },
  scales: {
    x: {
      display: false,
      stacked: true
    },
    y: {
      display: false,
      stacked: true
    }
  },
  plugins: {
    legend: {
      display: true,
      position: 'right'
    },
    datalabels: {
      color: 'white',
      display: function (context) {
        return context.dataset.data[context.dataIndex]
      },
      font: {
        weight: 'bold'
      },
      formatter: function (item, context) {
        return context.dataset.data[context.dataIndex] + ' SP'
      },
      align: 'center', // Centra orizzontalmente
      anchor: 'center' // Centra verticalmente
    }
  }
}

exports.doughnutChartChartAnalysisOptions = {
  plugins: {
    datalabels: {
      color: 'black',
      display: function (context) {
        return context.dataset.data[context.dataIndex]
      },
      font: {
        weight: 'normal'
      },
      formatter: function (item, context) {
        return context.dataset.data[context.dataIndex] + ' SP'
      },
      align: 'center', // Centra orizzontalmente
      anchor: 'center' // Centra verticalmente
    },
    legend: {
      display: true,
      position: 'bottom',
      align: 'start'
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
