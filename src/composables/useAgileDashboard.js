import { ApiFactory } from 'src/api/apiFactory'
const AgileDashboardService = ApiFactory.get('agileDashboard')
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'

const agileDashboardProjectList = ref([])
const agileDashboardStatusList = ref([])
const selectedRapidView = ref({})
const lastSprint = ref({})
const issueSprintDetail = ref({})

export default function useAgileDashboard () {
  const $q = useQuasar()

  async function getListOfProject () {
    $q.loading.show()
    const { data } = await AgileDashboardService.getListOfProject()
    agileDashboardProjectList.value = data.agileDashboardProjectList
    $q.loading.hide()
  }

  async function getListStatus () {
    $q.loading.show()
    const { data } = await AgileDashboardService.getListStatus()
    agileDashboardStatusList.value = data.agileDashboardStatusList
    $q.loading.hide()
  }

  async function getRapidViewFromProject (projectName) {
    $q.loading.show()
    const { data } = await AgileDashboardService.getRapidViewFromProject(projectName)
    selectedRapidView.value = data.rapidView
  }

  async function getLastSprintForRapidView (rapidViewId) {
    const { data } = await AgileDashboardService.getLastSprintForRapidView(rapidViewId)
    lastSprint.value = data.sprintDetail
  }

  async function getBoardIssuesForSprint (rapidViewId, sprintId) {
    const { data } = await AgileDashboardService.getBoardIssuesForSprint(rapidViewId, sprintId)
    issueSprintDetail.value = data.issueSprintDetail
    $q.loading.hide()
  }

  function resetAgileDashboardValue () {
    selectedRapidView.value = {}
    lastSprint.value = {}
    issueSprintDetail.value = {}
  }

  return {
    agileDashboardProjectList: computed(() => agileDashboardProjectList.value),
    selectedRapidView: computed(() => selectedRapidView.value),
    lastSprint: computed(() => lastSprint.value),
    issueSprintDetail: computed(() => issueSprintDetail.value),
    agileDashboardStatusList: computed(() => agileDashboardStatusList.value),
    getListOfProject,
    getRapidViewFromProject,
    getLastSprintForRapidView,
    getBoardIssuesForSprint,
    resetAgileDashboardValue,
    getListStatus
  }
}
