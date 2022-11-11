<script setup>
import useAgileDashboard from 'src/composables/useAgileDashboard'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import IssueTable from 'components/issueTable'
import { date } from 'quasar'
// import { fasBusinessTime } from '@quasar/extras/fontawesome-v6'

const router = useRouter()
const { selectedRapidView, lastSprint, issueSprintDetail, getLastSprintForRapidView, getBoardIssuesForSprint } = useAgileDashboard()

onMounted(async () => {
  if (selectedRapidView.value.id) {
    await getLastSprintForRapidView(selectedRapidView.value.id)
    await getBoardIssuesForSprint(selectedRapidView.value.id, lastSprint.value.sprint.id)
  } else {
    await router.push({ path: '/' })
  }
})

const getFormattedDate = (sprintDate) => {
  const d = new Date(sprintDate)
  return date.formatDate(d, 'DD-MM-YYYY')
}

const getBusinessDatesCount = (startDate, endDate) => {
  // startDate = new Date(startDate).setDate(new Date(startDate).getDate() + 1)
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
  return count
}
</script>

<template>
  <q-page v-if="selectedRapidView.id  && lastSprint.sprint && lastSprint.sprint.id && issueSprintDetail.issues && issueSprintDetail.issues.length > 0">
    <div class="row q-pt-md">
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
      <div class="col-6">
        <issue-table :issues="issueSprintDetail.issues" :sprint-detail="lastSprint"></issue-table>
      </div>
    </div>
  </q-page>
</template>

<style scoped>

</style>
