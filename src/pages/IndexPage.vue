<script setup>
import useAgileDashboard from 'src/composables/useAgileDashboard'
import { getProjectNameForRapidViewRequest, VIEW_SCRUM } from 'src/utils'
import { useRouter } from 'vue-router'
import { Loading } from 'quasar'

const router = useRouter()
const { agileDashboardProjectList, getRapidViewFromProject, resetAgileDashboardValue, getRapidViewFromAgileProject } = useAgileDashboard()

resetAgileDashboardValue()

const projectDetail = async (project) => {
  Loading.show()
  const p = VIEW_SCRUM ? getProjectNameForRapidViewRequest(project.name).scrumNameForRapidView : getProjectNameForRapidViewRequest(project.name).kanbanNameForRapidView
  console.log('projectDetail: ' + p)
  if (!p.includes('SmallChanges')) {
    await getRapidViewFromAgileProject()
  }
  await getRapidViewFromProject(p)
  await router.push({ path: '/dashboard' })
}

</script>

<template>
  <transition name="fade" mode="out-in">
    <q-page class="flex flex-center">
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
  </transition>
</template>

<style scoped>

</style>
