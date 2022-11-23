<script setup>
import useAgileDashboard from 'src/composables/useAgileDashboard'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import IssueTable from 'components/issueTable'
import { DoughnutChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import {
  getStatusChartData,
  doughnutChartOptions,
  getBusinessDatesCount,
  getFormattedDate,
  statusLabel,
  getBackgroundColorChart
} from 'src/utils'

const router = useRouter()
Chart.register(...registerables)

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
  const labels = statusLabel
  return {
    labels,
    datasets: [
      {
        data: getStatusChartData(labels, issues),
        backgroundColor: getBackgroundColorChart(labels)
      }
    ]
  }
}

</script>
<template>
  <transition name="fade" mode="out-in">
    <q-page v-if="agileDashboardStatusList && agileDashboardStatusList.length > 0 && selectedRapidView.id  && lastSprint.sprint && lastSprint.sprint.id && issueSprintDetail.issues && issueSprintDetail.issues.length > 0">
      <div class="row q-py-md">
        <q-card bordered class="col-8 offset-2">
          <div class="bg-primary text-white text-h6 text-capitalize text-center" style="padding: 6px 16px">
            SPRINT {{ lastSprint.sprint.name }}
          </div>
          <div class="flex justify-around items-center text-capitalize">
            <div class="column justify-center items-center">
              <div class="text-h6 text-accent text-bold">
                start Date
              </div>
              <div style="font-size: 1.1rem" v-text="getFormattedDate(lastSprint.sprint.startDate)"></div>
            </div>
            <div class="column justify-center items-center q-mx-lg">
              <div class="text-h6 text-accent text-bold">
                End Date
              </div>
              <div style="font-size: 1.1rem" v-text="getFormattedDate(lastSprint.sprint.endDate)"></div>
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
      <div class="row items-start">
        <div class="col-10 offset-1">
          <issue-table :issues="issueSprintDetail.issues" :sprint-detail="lastSprint"></issue-table>
        </div>
        <div class="col-6 q-pa-md">
          <q-card bordered>
            <q-card-section>
              <div class="text-h6 text-primary">Activities status summary</div>
            </q-card-section>
            <q-separator dark inset />
            <q-card-section>
              <DoughnutChart class="q-pl-lg" :height=300 :chartData="getChartStatusData(issueSprintDetail.issues)" :options="doughnutChartOptions"></DoughnutChart>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page>
  </transition>
</template>

<style scoped>

</style>
