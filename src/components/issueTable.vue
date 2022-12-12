<script setup>
import { defineProps, toRefs, ref } from 'vue'
import useTable from 'src/composables/useTable'
import { DELOITTE_TEAM, getStatusTableColor } from 'src/utils'

const props = defineProps({
  issues: Array,
  sprintDetail: Object
})
const { columns } = useTable()
const { issues, sprintDetail } = toRefs(props)
const pagination = ref({
  rowsPerPage: 5
})
const isBusinessPlatforms = (arr) => {
  return arr.some((el) => {
    return el.id === '10414'
  })
}

const isTechnicalPlatforms = (arr) => {
  return arr.some((el) => {
    return el.id === '10405'
  })
}

const isDeloitteTeam = (name) => {
  return DELOITTE_TEAM.includes(name)
}
</script>

<template>
  <div class="q-pa-md" v-if="issues && issues.length > 0 && sprintDetail && sprintDetail.sprint.name">
    <q-table
      :rows="issues"
      separator="cell"
      :columns="columns.issueColumns"
      dense
      bordered
      wrap-cells
      row-key="key"
      :pagination="pagination"
    >
      <template v-slot:top>
        <div class="full-width">
          <div class="text-h6 text-white text-center">Activities</div>
        </div>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            style="font-size: 1rem !important;"
            :key="col.name"
            :props="props"
            class="text-bold text-body2 text-uppercase text-secondary">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="key" :auto-width="true" :props="props" class="text-bold">
            <a :href="'https://jira.skylogic.com:8443/browse/' + props.row.key">{{ props.row.key }}</a>
          </q-td>
          <q-td key="summary" :auto-width="true" :props="props">
            {{ props.row.fields.summary }}
          </q-td>
          <q-td class="text-bold" key="status" :auto-width="true" :props="props" :style=getStatusTableColor(props.row.fields.status.name)>
            {{ props.row.fields.status.name }}
          </q-td>
          <q-td key="issuelinks" :auto-width="true" :props="props">
            <div v-if="props.row.fields.issuelinks.length > 0">
              <div v-for="issuelink in props.row.fields.issuelinks" :key="issuelink.id">
                <span v-if="issuelink.inwardIssue && issuelink.inwardIssue.key">{{issuelink.inwardIssue.key}}</span>
              </div>
              <div v-for="issuelink in props.row.fields.issuelinks" :key="issuelink.id">
                <span v-if="issuelink.outwardIssue && issuelink.outwardIssue.key">{{issuelink.outwardIssue.key}}</span>
              </div>
            </div>
            <div v-else>
             <q-icon name="close" color="negative"></q-icon>
            </div>
          </q-td>
          <q-td key="storyPoints" :auto-width="true" :props="props">
            <div v-if="props.row.fields.customfield_10106" class="text-bold">
              {{ props.row.fields.customfield_10106 }}
            </div>
            <div v-else>
              <q-icon name="close" color="negative"></q-icon>
            </div>
          </q-td>
          <q-td key="team" :auto-width="true" :props="props">
            <div v-if="!sprintDetail.sprint.name.includes('AG')">
              <div v-if="props.row.fields.customfield_10602">
                <div v-if="isBusinessPlatforms(props.row.fields.customfield_10602)" style="color: #8FBC8FFF" class="text-bold">
                  AGILE
                </div>
                <div v-if="isTechnicalPlatforms(props.row.fields.customfield_10602)" style="color: #2F4F4FFF" class="text-bold">
                  EMI
                </div>
              </div>
              <div v-else>
                -
              </div>
            </div>
            <div v-else>
              <div v-if="props.row.fields.assignee && isDeloitteTeam(props.row.fields.assignee.displayName)" style="color: #8FBC8FFF" class="text-bold">
                DELOITTE
              </div>
              <div v-else class="text-bold" style="color: #2F4F4FFF">
                SKYLOGIC
              </div>
            </div>
          </q-td>
          <q-td key="sprintList" :auto-width="true" :props="props">
            <div v-if="props.row.fields.customfield_10105 && props.row.fields.customfield_10105.length === 1" class="flex items-center justify-center q-gutter-x-sm">
              <q-icon name="done" size="sm" color="positive"></q-icon>
            </div>
            <div v-if="props.row.fields.customfield_10105 && props.row.fields.customfield_10105.length > 1" class="flex items-center justify-center q-gutter-x-sm">
              <q-icon name="close" size="sm" color="negative"></q-icon>
              <q-tooltip
                transition-show="scale"
                transition-hide="scale"
                class="bg-accent text-white text-bold"
                anchor="bottom middle" self="top middle">
                <div v-for="sprint in props.row.fields.customfield_10105" :key="sprint">
                  {{sprint.split(',')[3]}}
                </div>
              </q-tooltip>
            </div>
          </q-td>
          <q-td key="priority" :auto-width="true" :props="props">
            <div class="flex items-center justify-center q-gutter-x-sm">
              <q-avatar size="15px">
                <img :src="props.row.fields.priority.iconUrl">
              </q-avatar>
              <div>
                {{ props.row.fields.priority.name }}
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
</style>
