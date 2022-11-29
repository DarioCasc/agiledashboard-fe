<script setup>
import useAgileDashboard from 'src/composables/useAgileDashboard'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import IssueTable from 'components/issueTable'
import { BarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import {
  getStatusChartData,
  getTeamChartData,
  barChartStatusOptions,
  barChartTeamOptions,
  getBusinessDatesCount,
  getFormattedDate,
  statusLabel,
  getBackgroundColorChart,
  getBackgroundBorderColorChart,
  getStatusLabelWithPercentage,
  getGlobalPercentage
} from 'src/utils'
import TimeLine from 'components/TimeLine'
import { fasTimeline } from '@quasar/extras/fontawesome-v6'

const router = useRouter()
Chart.register(...registerables)
const dialog = ref(false)
const position = ref('top')

const open = (pos) => {
  position.value = pos
  dialog.value = true
}

const {
  selectedRapidView,
  lastSprint,
  issueSprintDetail,
  getLastSprintForRapidView,
  getBoardIssuesForSprint,
  agileDashboardStatusList
} = useAgileDashboard()

onMounted(async () => {
  if (selectedRapidView.value.id) {
    await getLastSprintForRapidView(selectedRapidView.value.id)
    await getBoardIssuesForSprint(selectedRapidView.value.id, lastSprint.value.sprint.id)
  } else {
    await router.push({ name: 'home' })
  }
})

const getChartStatusData = (issues) => {
  const labels = getStatusLabelWithPercentage(statusLabel, getStatusChartData(statusLabel, issues, false))
  return {
    labels,
    datasets: [
      {
        data: getStatusChartData(statusLabel, issues, false),
        backgroundColor: getBackgroundColorChart(statusLabel),
        borderColor: getBackgroundBorderColorChart(statusLabel),
        borderWidth: 2,
        barPercentage: 0.8
      }
    ]
  }
}

const getChartTeamData = (issues) => {
  console.log('last', lastSprint)
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

const getRemainingWeekNumber = (endDate) => {
  const start = new Date(getFormattedDate(endDate, 'YYYY-MM-DD'))
  const end = new Date('2022-12-05')
  const weeks = Math.round((start - end) / 604800000)
  return weeks
}

const getTotalStoryPoints = (issues) => {
  return issues.reduce((acc, issue) => {
    if (issue.fields.customfield_10106) {
      acc += issue.fields.customfield_10106
    }
    return acc
  }, 0)
}

</script>
<template>
  <transition name="fade" mode="out-in">
    <q-page v-if="agileDashboardStatusList && agileDashboardStatusList.length > 0 && selectedRapidView.id  && lastSprint.sprint && lastSprint.sprint.id && issueSprintDetail.issues && issueSprintDetail.issues.length > 0">
      <div class="row ">
        <div class="col-7 q-pa-md">
          <q-card bordered>
            <div class="bg-primary text-white text-h6 text-capitalize text-center flex items-center justify-center" style="padding: 6px 16px">
              <div>
                SPRINT {{ lastSprint.sprint.name }}
              </div>
              <div class="q-mx-xs"></div>
              <q-btn
                :icon="fasTimeline"
                size="sm"
                @click="open('left')"
                color="white"
                text-color="primary"
                round
                push
              />
            </div>
            <div class="flex justify-around items-center text-capitalize">
              <div class="column justify-center items-center">
                <div class="text-h6 text-accent text-bold">
                  start Date
                </div>
                <div style="font-size: 1.1rem" v-text="getFormattedDate(lastSprint.sprint.startDate, 'DD-MM-YYYY')"></div>
              </div>
              <div class="column justify-center items-center q-mx-lg">
                <div class="text-h6 text-accent text-bold">
                  End Date
                </div>
                <div style="font-size: 1.1rem" v-text="getFormattedDate(lastSprint.sprint.endDate, 'DD-MM-YYYY')"></div>
              </div>
              <div class="column justify-center items-center">
                <div class="text-h6 text-accent text-bold">
                  days Remaining
                </div>
                <div style="font-size: 1.1rem" v-text="getBusinessDatesCount(new Date(), new Date(lastSprint.sprint.endDate))"></div>
              </div>
            </div>
          </q-card>
        </div>
        <div class="col-5 q-pa-md column justify-end">
          <q-card class="flex justify-around items-center text-capitalize q-py-xs" bordered>
            <div class="column justify-center items-center">
              <div class="text-h6 text-secondary text-bold">
                min. goal
              </div>
              <q-badge outline align="middle" color="positive" class="text-bold" style="font-size: 1.1rem">75%</q-badge>
            </div>
            <div class="column justify-center items-center">
              <div class="text-h6 text-secondary text-bold">
                expected goal
              </div>
              <q-badge outline align="middle" color="positive" class="text-bold" style="font-size: 1.1rem" v-if="getExpectedGoal(issueSprintDetail.issues) > 75">
                {{getExpectedGoal(issueSprintDetail.issues)}}%
              </q-badge>
              <q-badge  v-else outline align="middle" color="negative" class="text-bold" style="font-size: 1.1rem">
                {{getExpectedGoal(issueSprintDetail.issues)}}%
              </q-badge>
            </div>
          </q-card>
        </div>
      </div>
      <div class="row justify-around">
        <div class="col-7">
          <issue-table :issues="issueSprintDetail.issues" :sprint-detail="lastSprint"></issue-table>
        </div>
        <div class="col-5 q-pa-md">
          <q-card bordered>
            <q-card-section>
              <div class="text-h6 text-primary text-capitalize">Activities status summary</div>
            </q-card-section>
            <q-separator dark inset />
            <q-card-section>
              <BarChart class="q-pl-lg" :height=300 :chartData="getChartStatusData(issueSprintDetail.issues)" :options="barChartStatusOptions"></BarChart>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <div v-if="true" class="row justify-around">
        <div class="col-4 q-pa-md">
          <q-card bordered>
            <q-card-section class="flex justify-between items-center">
              <div class="text-h6 text-primary text-capitalize">Activities team summary</div>
              <q-badge outline color="secondary" style="" class="text-bold">Total Story Points: {{ getTotalStoryPoints(issueSprintDetail.issues) }}</q-badge>
            </q-card-section>
            <q-separator dark inset />
            <q-card-section>
              <BarChart class="q-pl-lg" :height=300 :chartData="getChartTeamData(issueSprintDetail.issues)" :options="barChartTeamOptions"></BarChart>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-8 q-pa-md">
        </div>
      </div>
      <q-dialog v-model="dialog" :position="position">
        <q-card style="width: 300px">
          <q-card-section>
            <time-line :remaining-week-number="getRemainingWeekNumber(lastSprint.sprint.endDate)"></time-line>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page>
  </transition>
</template>

<style scoped>

</style>
