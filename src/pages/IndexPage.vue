<script setup>
import useAgileDashboard from 'src/composables/useAgileDashboard'
import { getProjectNameForRapidViewRequest, VIEW_SCRUM } from 'src/utils'
import { useRouter } from 'vue-router'

const router = useRouter()
const { agileDashboardProjectList, getRapidViewFromProject } = useAgileDashboard()

const projectDetail = async (project) => {
  const p = VIEW_SCRUM ? getProjectNameForRapidViewRequest(project.name).scrumNameForRapidView : getProjectNameForRapidViewRequest(project.name).kanbanNameForRapidView
  await getRapidViewFromProject(p)
  await router.push({ path: '/dashboard' })
}

</script>

<template>
  <q-page class="flex flex-center" v-if="agileDashboardProjectList && agileDashboardProjectList.length > 0">
    <div class="flex justify-around full-width">
      <q-card bordered
              @click="projectDetail(project)"
              class="my-card flex cursor-pointer project-card"
              v-for="project in agileDashboardProjectList" :key="project.id">
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <img :src="project.avatarUrls['16x16']">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-h6">{{ project.name }}</q-item-label>
            <q-item-label caption>{{ project.key }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
    </div>
  </q-page>
</template>
