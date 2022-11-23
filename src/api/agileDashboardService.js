import ApiService from 'src/api/apiService'

const resource = '/agile-dashboard'

export default {
  getListOfProject () {
    return ApiService.get(resource + '/projects')
  },
  getListStatus () {
    return ApiService.get(resource + '/listStatus')
  },
  getRapidViewFromProject (projectName) {
    return ApiService.get(resource + '/rapidView/' + projectName)
  },
  getLastSprintForRapidView (rapidViewId) {
    return ApiService.get(resource + '/sprint/' + rapidViewId)
  },
  getBoardIssuesForSprint (rapidViewId, sprintId) {
    return ApiService.get(resource + '/rapidView/' + rapidViewId + '/sprint/' + sprintId)
  }
}
