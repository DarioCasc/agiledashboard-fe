<script setup>
import useAgileDashboard from 'src/composables/useAgileDashboard'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import IssueTable from 'components/issueTable'
import { BarChart, DoughnutChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Loading, date } from 'quasar'
import {
  getStatusChartData,
  getTeamChartData,
  barChartStatusOptions,
  barChartTeamOptions,
  barChartStoryPointOptions,
  doughnutChartChartAnalysisOptions,
  getBusinessDatesCount,
  getFormattedDate,
  statusLabel,
  getBackgroundBorderColorChart,
  // getStatusLabelWithPercentage,
  getGlobalPercentage,
  getOrderChart,
  getStatusLabelWithOnlyPercentage
} from 'src/utils'
import TimeLine from 'components/TimeLine'
import { fasTimeline, farClock, fasCode, farChartBar, fasBusinessTime } from '@quasar/extras/fontawesome-v6'
import AttentionPointTable from 'components/AttentionPointTable'

const router = useRouter()
Chart.register(...registerables)
Chart.register(ChartDataLabels)
const dialog = ref(false)
const position = ref('top')
// const analysisModel = ref('BR')

const open = (pos) => {
  position.value = pos
  dialog.value = true
}

const {
  selectedRapidView,
  agileRapidView,
  lastSprint,
  lastAgileSprint,
  isBrIrSprint,
  issueSprintDetail,
  issueAgileSprintDetail,
  issueDuringFraming,
  getLastSprintForRapidView,
  getBoardIssuesForSprint,
  getIssueDuringFraming,
  agileDashboardStatusList
} = useAgileDashboard()

onMounted(async () => {
  if (selectedRapidView.value.id) {
    await getLastSprintForRapidView(selectedRapidView.value.id, false)
    await getBoardIssuesForSprint(selectedRapidView.value.id, lastSprint.value.sprint.id, false, isBrIrSprint.value)
    if (isBrIrSprint.value && agileRapidView.value.id) {
      await getLastSprintForRapidView(agileRapidView.value.id, true)
      await getBoardIssuesForSprint(agileRapidView.value.id, lastAgileSprint.value.sprint.id, true, isBrIrSprint.value)
      const project = lastSprint.value.sprint.name.includes('BR') ? 'BR' : 'IR'
      await getIssueDuringFraming(project)
    }
    Loading.hide()
  } else {
    await router.push({ name: 'home' })
  }
})

const getIssueLinkList = () => {
  const issueLinkList = issueSprintDetail.value.issues.map((issue) => {
    return issue.fields.issuelinks
  }).flat(Infinity)

  const issueLinkListSet = new Set(issueLinkList.map(item => item.inwardIssue ? item.inwardIssue.id : item.outwardIssue.id))
  return issueAgileSprintDetail.value.issues.filter(item => issueLinkListSet.has(item.id))
}

const getChartStatusData = (issues) => {
  const labels = ['']
  const data = getStatusChartData(statusLabel, issues, false)
  const datasets = []
  for (const [key, value] of Object.entries(data)) {
    datasets.push({
      label: key,
      data: [value],
      backgroundColor: getBackgroundBorderColorChart(key),
      order: getOrderChart(key),
      percentage: [getStatusLabelWithOnlyPercentage(key, getStatusChartData(statusLabel, issues, false))]
    })
  }
  return {
    labels,
    datasets
  }
}

const getCharStoryPointData = (totalStoryPoints, totalStoryPointsWorked, totalStoryPointsWorkedWithAnalysis) => {
  return {
    labels: [''],
    datasets: [
      {
        label: 'Logged [Build]',
        data: [totalStoryPointsWorked],
        backgroundColor: '#51a825',
        stack: 'combined'
      },
      {
        label: 'Logged [Other]',
        data: [totalStoryPointsWorkedWithAnalysis],
        backgroundColor: '#FCD037',
        stack: 'combined'
      }
    ]
  }
}

const getChartAnalysis = (analysisDuringSprint, analysisDuringFraming) => {
  return {
    labels: ['Analysis during Sprint', 'Analysis during Framing'],
    datasets: [
      {
        label: '# ore',
        data: [analysisDuringSprint, analysisDuringFraming],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }
    ]
  }
}

const getChartOtherActivities = (codeScan, processBuilder) => {
  return {
    labels: ['Code Scan                   ', 'Process Builder'],
    datasets: [
      {
        label: '# ore',
        data: [codeScan, processBuilder],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }
    ]
  }
}

const getChartTeamData = (issues) => {
  const labels = !lastSprint.value.sprint.name.includes('AG') ? ['AGILE', 'EMI'] : ['DELOITTE', 'SKYLOGIC']
  return {
    labels,
    datasets: [
      {
        data: getTeamChartData(labels, issues, lastSprint.value.sprint.name.includes('AG')),
        backgroundColor: ['rgba(143, 188, 143, 0.5)', 'rgba(47, 79, 79, 0.5)'],
        borderColor: ['#8FBC8FFF', '#2F4F4FFF'],
        borderWidth: 2,
        barPercentage: 0.5
      }
    ]
  }
}

const getExpectedGoal = (issues) => {
  return getGlobalPercentage(getStatusChartData(statusLabel, issues, true), issues)
}

const getFinalGoal = (issues) => {
  return getGlobalPercentage(getStatusChartData(statusLabel, issues, false, true), issues)
}

const getRemainingWeekNumber = (endDate) => {
  const start = new Date(getFormattedDate(endDate, 'YYYY-MM-DD'))
  const end = new Date()
  const weeks = Math.round((start - end) / 604800000)
  return weeks
}

const getTotalStoryPoints = computed(() => {
  const totalSP = issueSprintDetail.value.issues.reduce((acc, issue) => {
    if (issue.fields.customfield_11102) {
      if (issue.fields.customfield_10906 && issue.fields.customfield_10907) {
        const sp = parseInt(issue.fields.customfield_11102.split('-')[issue.fields.customfield_11102.split('-').length - 1].trim().split('/')[0])
        acc += sp
      } else {
        const sp = parseInt(issue.fields.customfield_11102.split('-')[issue.fields.customfield_11102.split('-').length - 1].trim())
        acc += sp
      }
    } else {
      acc += issue.fields.customfield_10906
    }
    return acc
  }, 0)

  if (totalSP % 0.5 === 0) {
    return totalSP
  } else {
    return Math.round(totalSP)
  }
})

const getTotalStoryPointsWorked = computed(() => {
  const { extractDate, isBetweenDates } = date

  const sprintStartDate = extractDate(lastSprint.value.sprint.startDate, 'DD/MMM/YY h:mm A')
  const sprintEndDate = extractDate(lastSprint.value.sprint.endDate, 'DD/MMM/YY h:mm A')

  const totalTimeSpentSeconds = getIssueLinkList().reduce((acc, issue) => {
    if (issue.fields.worklog && Array.isArray(issue.fields.worklog.worklogs)) {
      issue.fields.worklog.worklogs.forEach(worklog => {
        const worklogDate = new Date(worklog.started)

        if (isBetweenDates(worklogDate, sprintStartDate, sprintEndDate)) {
          acc += worklog.timeSpentSeconds || 0
        }
      })
    }
    return acc
  }, 0)

  const totalStoryPoints = (totalTimeSpentSeconds / 3600) / 8

  if (totalStoryPoints % 0.5 === 0) {
    return totalStoryPoints
  } else {
    return Math.round(totalStoryPoints)
  }
})

const isSprintFinished = computed(() => {
  const { extractDate } = date
  const sprintEndDate = extractDate(lastSprint.value.sprint.endDate, 'DD/MMM/YY h:mm A')
  return sprintEndDate < new Date()
})

const getTotalStoryPointsWorkedWithAnalysis = computed(() => {
  if (lastSprint.value.sprint.name.includes('BR')) {
    return getTimeForAnalysisDuringSprint.value + getTimeForAnalysisDuringFraming.value
  } else {
    return getTimeForAnalysisDuringSprint.value + getTimeForAnalysisDuringFraming.value + getProcessBuilderActivities.value + getCodeScanActivities.value
  }
})

const getTotalSubTask = () => {
  return issueAgileSprintDetail.value.issues.filter(item => item.fields.issuetype.subtask)
}

const getTimeForAnalysisDuringSprint = computed(() => {
  const { extractDate, isBetweenDates } = date
  const sprintStartDate = extractDate(lastSprint.value.sprint.startDate, 'DD/MMM/YY h:mm A')
  const sprintEndDate = extractDate(lastSprint.value.sprint.endDate, 'DD/MMM/YY h:mm A')

  const issueLinkList = getIssueLinkList()
  const subTaskList = getTotalSubTask().filter(item => item.fields.summary === 'Analysis during Sprint')
  const subTaskFilteredList = []
  subTaskList.forEach((st) => {
    issueLinkList.forEach((issueLink) => {
      if (issueLink.fields.subtasks && issueLink.fields.subtasks.length > 0) {
        issueLink.fields.subtasks.forEach((subtask) => {
          if (st.id === subtask.id) {
            subTaskFilteredList.push(st)
          }
        })
      }
    })
  })
  let totalTimeSpentSeconds = 0

  subTaskFilteredList.forEach((subTask) => {
    if (subTask.fields.worklog && subTask.fields.worklog.worklogs) {
      subTask.fields.worklog.worklogs.forEach(worklog => {
        const worklogDate = new Date(worklog.started)

        if (isBetweenDates(worklogDate, sprintStartDate, sprintEndDate)) {
          totalTimeSpentSeconds += worklog.timeSpentSeconds
        }
      })
    }
  })

  const totalStoryPoints = (totalTimeSpentSeconds / 3600) / 8
  console.log('getTimeForAnalysisDuringSprint: ', totalStoryPoints)
  return (totalStoryPoints % 0.5 === 0) ? totalStoryPoints : Math.round(totalStoryPoints)
})

const getTimeForAnalysisDuringFraming = computed(() => {
  const { extractDate, isBetweenDates } = date
  const sprintStartDate = extractDate(lastSprint.value.sprint.startDate, 'DD/MMM/YY h:mm A')
  const sprintEndDate = extractDate(lastSprint.value.sprint.endDate, 'DD/MMM/YY h:mm A')

  const issueLinkList = getIssueLinkList()
  const subTaskList = getTotalSubTask().filter(item => item.fields.summary === 'Analysis during Framing')
  const subTaskFilteredList = []
  subTaskList.forEach((st) => {
    issueLinkList.forEach((issueLink) => {
      if (issueLink.fields.subtasks && issueLink.fields.subtasks.length > 0) {
        issueLink.fields.subtasks.forEach((subtask) => {
          if (st.id === subtask.id) {
            subTaskFilteredList.push(st)
          }
        })
      }
    })
  })
  let totalTimeSpentSeconds = 0

  subTaskFilteredList.concat(issueDuringFraming.value).forEach((subTask) => {
    if (subTask.fields.worklog && subTask.fields.worklog.worklogs) {
      subTask.fields.worklog.worklogs.forEach(worklog => {
        const worklogDate = new Date(worklog.started)

        if (isBetweenDates(worklogDate, sprintStartDate, sprintEndDate)) {
          totalTimeSpentSeconds += worklog.timeSpentSeconds
        }
      })
    }
  })

  const totalStoryPoints = (totalTimeSpentSeconds / 3600) / 8
  console.log('getTimeForAnalysisDuringFraming: ', totalTimeSpentSeconds)
  return (totalStoryPoints % 0.5 === 0) ? totalStoryPoints : Math.round(totalStoryPoints)
})

const getCodeScanActivities = computed(() => {
  const subTaskList = issueAgileSprintDetail.value.issues.filter(item => item.fields.summary.includes('CodeScan'))
  const totalTimeSpentSeconds = subTaskList.reduce((acc, subTask) => {
    acc += subTask.fields.timetracking && subTask.fields.timetracking.timeSpentSeconds ? subTask.fields.timetracking.timeSpentSeconds : 0
    return acc
  }, 0)
  const totalStoryPoints = (totalTimeSpentSeconds / 3600) / 8
  if (totalStoryPoints % 0.5 === 0) {
    return totalStoryPoints
  } else {
    return Math.round(totalStoryPoints)
  }
})

const getProcessBuilderActivities = computed(() => {
  const { extractDate, isBetweenDates } = date
  const sprintStartDate = extractDate(lastSprint.value.sprint.startDate, 'DD/MMM/YY h:mm A')
  const sprintEndDate = extractDate(lastSprint.value.sprint.endDate, 'DD/MMM/YY h:mm A')
  const subTaskList = issueAgileSprintDetail.value.issues.filter(item => item.fields.summary.includes('ProcessBuilder'))
  let totalTimeSpentSeconds = 0

  subTaskList.forEach((subTask) => {
    if (subTask.fields.worklog && subTask.fields.worklog.worklogs) {
      subTask.fields.worklog.worklogs.forEach(worklog => {
        const worklogDate = new Date(worklog.started)
        if (isBetweenDates(worklogDate, sprintStartDate, sprintEndDate)) {
          totalTimeSpentSeconds += worklog.timeSpentSeconds
        }
      })
    }
  })

  const totalStoryPoints = (totalTimeSpentSeconds / 3600) / 8

  if (totalStoryPoints % 0.5 === 0) {
    return totalStoryPoints
  } else {
    return Math.round(totalStoryPoints)
  }
})

</script>
<template>
  <transition name="fade" mode="out-in">
    <q-page v-if="agileDashboardStatusList && agileDashboardStatusList.length > 0 && selectedRapidView.id  && lastSprint.sprint && lastSprint.sprint.id && issueSprintDetail.issues && issueSprintDetail.issues.length > 0 && issueAgileSprintDetail.issues && issueAgileSprintDetail.issues.length >0">
      <div class="justify-around q-py-lg row">
        <q-card class="col-5" bordered>
          <div class="bg-secondary text-white text-capitalize flex items-center q-pl-md">
            <div style="font-size: 18px;" class="q-py-xs">
              Sprint Overview
            </div>
            <div class="q-mx-xs"></div>
          </div>
          <div class="flex justify-between items-center q-mt-sm q-px-md">
            <div class="column">
              <div class="text-h6 text-bold flex items-center">
                <div class="q-mr-xs">SPRINT {{ lastSprint.sprint.name }}</div>
                <q-icon :name="fasTimeline" color="primary" class="cursor-pointer"  @click="open('left')"></q-icon>
              </div>
              <div class="text-grey-6 text-bold text-italic" style="font-size: 12px">
                days left {{getBusinessDatesCount(new Date(), new Date(lastSprint.sprint.endDate))}}
              </div>
            </div>
            <div class="column justify-center items-center text-capitalize">
              <div class="q-mb-xs text-bold">
                min. goal
              </div>
              <q-circular-progress
                show-value
                font-size="12px"
                :value=80
                size="50px"
                :thickness="0.20"
                color="positive"
                track-color="grey-3"
              >
                    80%
              </q-circular-progress>
            </div>
            <div class="column justify-center items-center text-capitalize" v-if="!isSprintFinished">
              <div class="q-mb-xs text-bold">
                expected goal
              </div>
              <q-circular-progress
                v-if="getExpectedGoal(issueSprintDetail.issues) > 80"
                show-value
                font-size="12px"
                :value="getExpectedGoal(issueSprintDetail.issues)"
                size="50px"
                :thickness="0.20"
                color="positive"
                track-color="grey-3"
              >
                {{ getExpectedGoal(issueSprintDetail.issues) }}%
              </q-circular-progress>
              <q-circular-progress
                v-else
                show-value
                font-size="12px"
                :value="getExpectedGoal(issueSprintDetail.issues)"
                size="50px"
                :thickness="0.20"
                color="negative"
                track-color="grey-3"
              >
                {{ getExpectedGoal(issueSprintDetail.issues) }}%
              </q-circular-progress>
            </div>
            <div class="column justify-center items-center text-capitalize" v-else>
              <div class="q-mb-xs text-bold">
                goal
              </div>
              <q-circular-progress
                v-if="getFinalGoal(issueSprintDetail.issues) >= 80"
                show-value
                font-size="12px"
                :value="getFinalGoal(issueSprintDetail.issues)"
                size="50px"
                :thickness="0.20"
                color="positive"
                track-color="grey-3"
              >
                {{ getFinalGoal(issueSprintDetail.issues) }}%
              </q-circular-progress>
              <q-circular-progress
                v-else
                show-value
                font-size="12px"
                :value="getFinalGoal(issueSprintDetail.issues)"
                size="50px"
                :thickness="0.20"
                color="negative"
                track-color="grey-3"
              >
                {{ getFinalGoal(issueSprintDetail.issues) }}%
              </q-circular-progress>
            </div>
          </div>
          <q-separator class="q-my-sm"></q-separator>
          <div style="font-size: 16px" class="q-px-md text-uppercase text-primary text-bold">Overall Sprint Progress</div>
          <div class="q-px-md">
            <BarChart :height='120' :chartData="getChartStatusData(issueSprintDetail.issues)" :options="barChartStatusOptions"></BarChart>
          </div>
          <div style="font-size: 16px" class="q-px-md q-pt-lg text-uppercase text-primary text-bold">{{lastSprint.sprint.name.split('.')[0]}} Overall Sprint Story Points</div>
          <div class="q-px-md" v-if="false">
            <BarChart :height='80' :chartData="getCharStoryPointData(getTotalStoryPoints, getTotalStoryPointsWorked, getTotalStoryPointsWorkedWithAnalysis)" :options="barChartStoryPointOptions"></BarChart>
          </div>
          <div class="q-pa-md row items-start q-gutter-md">
            <q-card class="my-card" flat bordered>
              <q-list bordered separator>
                <q-item >
                  <q-item-section avatar>
                    <q-icon color="primary" :name="fasBusinessTime" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-uppercase text-bold">Declared Capacity</q-item-label>
                    <q-item-label caption>Agile Team</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label v-if="lastSprint.sprint.name.includes('BR')" class="text-bold text-primary q-ml-md">42 SP</q-item-label>
                    <q-item-label v-if="lastSprint.sprint.name.includes('IR')" class="text-bold text-primary q-ml-md">12 SP</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon color="primary" :name="farClock" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-uppercase text-bold">Committement</q-item-label>
                    <q-item-label caption>Agile Team</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-bold text-primary q-ml-md">{{getTotalStoryPoints}} SP</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon color="primary" :name="fasCode" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-uppercase text-bold">Developments</q-item-label>
                    <q-item-label caption>Logged (Agile Team)</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-bold text-primary q-ml-md">{{getTotalStoryPointsWorked}} SP</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon color="primary" :name="farChartBar" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-uppercase text-bold">Analysis & Other Activities</q-item-label>
                    <q-item-label caption>Logged (Agile Team)</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-bold text-primary q-ml-md">{{getTotalStoryPointsWorkedWithAnalysis}} SP</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
          <div class="q-px-md q-py-md" v-if="false">
            <q-btn outline color="primary" style="cursor: unset" size="12px">Total Logged SP: <span class="text-bold q-ml-md" style="font-size: 16px">{{getTotalStoryPointsWorked + getTotalStoryPointsWorkedWithAnalysis}}</span></q-btn>
          </div>
        </q-card>
        <q-card class="col-5" bordered v-if="getTimeForAnalysisDuringSprint != 0 || getTimeForAnalysisDuringFraming != 0 || (lastSprint.sprint.name.includes('IR') && (getCodeScanActivities != 0 || getProcessBuilderActivities != 0))">
          <div class="bg-secondary text-white text-capitalize flex items-center q-pl-md">
            <div style="font-size: 18px;" class="q-py-xs">
              Activities Breakdown
            </div>
          </div>

          <div class="flex">
            <div class="q-px-md" style="width: 50%" v-if="getTimeForAnalysisDuringSprint != 0 || getTimeForAnalysisDuringFraming != 0">
              <div style="font-size: 16px" class="q-pt-lg text-primary text-uppercase text-bold q-pb-md">Analysis {{lastSprint.sprint.name}}</div>
              <DoughnutChart :chartData="getChartAnalysis(getTimeForAnalysisDuringSprint, getTimeForAnalysisDuringFraming)" :options="doughnutChartChartAnalysisOptions"></DoughnutChart>
            </div>
            <div class="q-px-md" style="width: 50%" v-if="lastSprint.sprint.name.includes('IR') && (getCodeScanActivities > 0 || getProcessBuilderActivities > 0)">
              <div style="font-size: 16px" class="q-pt-lg text-primary text-bold text-uppercase q-pb-md">Other Activities</div>
              <DoughnutChart :chartData="getChartOtherActivities(getCodeScanActivities, getProcessBuilderActivities)" :options="doughnutChartChartAnalysisOptions"></DoughnutChart>
            </div>
          </div>
          <div v-if="lastSprint.sprint.name.includes('BR') && false" style="font-size: 16px" class="q-px-md q-pt-lg text-uppercase text-primary text-bold">Attention Points</div>
          <div class="q-ma-md" v-if="lastSprint.sprint.name.includes('BR') && false">
            <attention-point-table :issues="issueSprintDetail.issues" :sprint-detail="lastSprint"></attention-point-table>
          </div>
        </q-card>
      </div>
      <div class="justify-around row q-pb-lg q-mx-auto">
        <q-card class="col-11" bordered>
          <div class="bg-secondary text-white text-capitalize q-pl-md text-center">
            <div style="font-size: 18px;" class="q-py-xs">
              Activities Detail
            </div>
          </div>
          <div class="q-ma-lg">
            <issue-table :issues="issueSprintDetail.issues" :sprint-detail="lastSprint" :issueAgileSprintDetail="issueAgileSprintDetail"></issue-table>
          </div>
        </q-card>
        <!-- q-card class="q-ml-md" bordered v-if="false">
          <div class="bg-secondary text-white text-capitalize flex items-center q-pl-md">
            <div style="font-size: 18px;" class="q-py-xs">
              Attention Points
            </div>
          </div>
          <div class="q-ma-lg" v-if="lastSprint.sprint.name.includes('BR')">
            <attention-point-table :issues="issueSprintDetail.issues" :sprint-detail="lastSprint"></attention-point-table>
          </div>
        </q-card -->
      </div>
      <div v-if="false" class="row justify-around q-pa-md">
        <q-card class="col-5">
          <q-card-section class="flex justify-between items-center">
            <div class="text-h6 text-primary text-capitalize">Activities team summary</div>
            <q-badge outline color="secondary" style="font-size: 1.0rem" class="text-bold q-pa-sm">Total Story Points:
              {{ getTotalStoryPoints(issueSprintDetail.issues) }}
            </q-badge>
            <q-badge outline color="secondary" style="font-size: 1.0rem" class="text-bold q-pa-sm">Total Story Points:
              {{getTotalStoryPointsWorked}}
            </q-badge>
          </q-card-section>
          <q-separator dark inset/>
          <q-card-section>
            <BarChart :height=100 :chartData="getChartTeamData(issueSprintDetail.issues)"
                      :options="barChartTeamOptions"></BarChart>
          </q-card-section>
        </q-card>
      </div>
      <q-dialog v-model="dialog" :position="position">
        <q-card style="width: 300px">
          <q-card-section>
            <time-line :remaining-week-number="getRemainingWeekNumber(lastSprint.sprint.endDate)" :start-date="getFormattedDate(lastSprint.sprint.startDate, 'DD-MM-YYYY')"  :end-date="getFormattedDate(lastSprint.sprint.endDate, 'DD-MM-YYYY')"></time-line>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page>
  </transition>
</template>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
