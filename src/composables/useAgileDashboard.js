import { ApiFactory } from 'src/api/apiFactory'
const AgileDashboardService = ApiFactory.get('agileDashboard')
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'

const isBrIrSprint = ref(false)
const agileDashboardProjectList = ref([])
const agileDashboardStatusList = ref([])
const selectedRapidView = ref({})
const agileRapidView = ref({})
const lastSprint = ref({})
const lastAgileSprint = ref({})
const issueSprintDetail = ref({})
const issueAgileSprintDetail = ref({})

export default function useAgileDashboard () {
  const $q = useQuasar()

  async function getListOfProject () {
    $q.loading.show()
    const { data } = await AgileDashboardService.getListOfProject()
    agileDashboardProjectList.value = data.agileDashboardProjectList
  }

  async function getListStatus () {
    const { data } = await AgileDashboardService.getListStatus()
    agileDashboardStatusList.value = data.agileDashboardStatusList
    $q.loading.hide()
  }

  async function getRapidViewFromProject (projectName) {
    $q.loading.show()
    const { data } = await AgileDashboardService.getRapidViewFromProject(projectName)
    selectedRapidView.value = data.rapidView
    if (!projectName.includes('SmallChanges')) {
      isBrIrSprint.value = true
    }
  }

  async function getRapidViewFromAgileProject () {
    const { data } = await AgileDashboardService.getRapidViewFromProject('SmallChanges - SCRUM')
    agileRapidView.value = data.rapidView
  }

  async function getLastSprintForRapidView (rapidViewId, isAgile) {
    const { data } = await AgileDashboardService.getLastSprintForRapidView(rapidViewId)
    if (!isAgile) {
      lastSprint.value = data.sprintDetail
    } else {
      lastAgileSprint.value = data.sprintDetail
    }
  }

  async function getBoardIssuesForSprint (rapidViewId, sprintId, isAgile, isBrIrSprint) {
    const { data } = await AgileDashboardService.getBoardIssuesForSprint(rapidViewId, sprintId)
    if (isAgile) {
      issueAgileSprintDetail.value = data.issueSprintDetail
    } else {
      issueSprintDetail.value = data.issueSprintDetail
    }
    if (!isBrIrSprint) {
      issueAgileSprintDetail.value = data.issueSprintDetail
    }
  }

  function resetAgileDashboardValue () {
    selectedRapidView.value = {}
    lastSprint.value = {}
    lastAgileSprint.value = {}
    issueSprintDetail.value = {}
    issueAgileSprintDetail.value = {}
    isBrIrSprint.value = false
  }

  return {
    isBrIrSprint: computed(() => isBrIrSprint.value),
    agileDashboardProjectList: computed(() => agileDashboardProjectList.value),
    selectedRapidView: computed(() => selectedRapidView.value),
    agileRapidView: computed(() => agileRapidView.value),
    lastSprint: computed(() => lastSprint.value),
    lastAgileSprint: computed(() => lastAgileSprint.value),
    issueSprintDetail: computed(() => issueSprintDetail.value),
    issueAgileSprintDetail: computed(() => issueAgileSprintDetail.value),
    agileDashboardStatusList: computed(() => agileDashboardStatusList.value),
    getListOfProject,
    getRapidViewFromProject,
    getLastSprintForRapidView,
    getBoardIssuesForSprint,
    resetAgileDashboardValue,
    getRapidViewFromAgileProject,
    getListStatus
  }
}
