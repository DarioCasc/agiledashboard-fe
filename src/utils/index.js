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

exports.VIEW_SCRUM = true

exports.getProjectNameForRapidViewRequest = (projectName) => {
  return projectNameMapping.find(p => p.displayName === projectName)
}
