<script setup>
import { defineProps, toRefs, ref } from 'vue'
import useTable from 'src/composables/useTable'
import { DELOITTE_TEAM } from 'src/utils'

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
          <div class="text-h6 text-white text-center">Main Topics</div>
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
            {{ props.row.key }}
          </q-td>
          <q-td key="summary" :auto-width="true" :props="props">
            {{ props.row.fields.summary }}
          </q-td>
          <q-td key="status" :auto-width="true" :props="props">
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
            <div v-if="props.row.fields.customfield_10602 && !sprintDetail.sprint.name.includes('AG')">
              <div v-if="isBusinessPlatforms(props.row.fields.customfield_10602)">
                AGILE
              </div>
              <div v-if="isTechnicalPlatforms(props.row.fields.customfield_10602)">
                EMI
              </div>
            </div>
            <div v-else>
              <div v-if="isDeloitteTeam(props.row.fields.assignee.displayName)" style="color: #86BC24" class="text-bold">
                DELOITTE
              </div>
              <div v-else class="text-accent text-bold">
                SKYLOGIC
              </div>
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
</style>
