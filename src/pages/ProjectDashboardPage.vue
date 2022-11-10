<script setup>
import useAgileDashboard from 'src/composables/useAgileDashboard'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

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

</script>

<template>
  <q-page v-if="selectedRapidView.id  && lastSprint.sprint && lastSprint.sprint.id && issueSprintDetail.issues && issueSprintDetail.issues.length > 0" class="flex flex-center">
    <div>
    </div>
  </q-page>
</template>

<style scoped>

</style>
