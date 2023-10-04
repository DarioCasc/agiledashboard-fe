<script setup>
import { defineProps, toRefs, ref } from 'vue'
import useTable from 'src/composables/useTable'
import { DELOITTE_TEAM, getStatusTableColor, isTechnicalPlatforms, isBusinessPlatforms } from 'src/utils'

const props = defineProps({
  issues: Array,
  sprintDetail: Object
})
const { columns } = useTable()
const { issues, sprintDetail } = toRefs(props)
const pagination = ref({
  rowsPerPage: 10
})

const isDeloitteTeam = (name) => {
  return DELOITTE_TEAM.includes(name)
}
</script>

<template>
  <div v-if="issues && issues.length > 0 && sprintDetail && sprintDetail.sprint.name">
    <q-table
      :rows="issues"
      separator="cell"
      :columns="columns.issueColumns"
      dense
      bordered
      square
      flat
      wrap-cells
      row-key="key"
      :pagination="pagination"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            style="font-size: 14px !important;"
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
            <a :href="'https://jira.skylogic.com:8443/browse/' + props.row.key" target="_blank">{{ props.row.key }}</a>
            <q-tooltip
              transition-show="scale"
              transition-hide="scale"
              class="bg-accent text-white text-bold"
              anchor="bottom middle" self="top middle">
              {{props.row.fields.summary}}
            </q-tooltip>
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
          <q-td key="totalStoryPoints" :auto-width="true" :props="props">
            <div v-if="props.row.fields.customfield_10106" class="text-bold">
              {{ props.row.fields.customfield_10106 }}
            </div>
            <div v-else>
              <q-icon name="horizontal_rule" color="negative"></q-icon>
            </div>
          </q-td>
          <q-td key="remainingStoryPoints" :auto-width="true" :props="props">
            <div v-if="props.row.fields.customfield_11102" class="text-bold">
              {{ props.row.fields.customfield_11102.split('-')[props.row.fields.customfield_11102.split('-').length -1] }}
            </div>
            <div v-else-if="props.row.fields.customfield_10906 && props.row.fields.customfield_10907" class="text-bold">
             <div> {{ props.row.fields.customfield_10906 }} </div>
             <div> {{ props.row.fields.customfield_10907 }} </div>
            </div>
            <div v-else-if="props.row.fields.customfield_10906" class="text-bold">
              <div> {{ props.row.fields.customfield_10906 }} </div>
            </div>
            <div v-else-if="props.row.fields.customfield_10907" class="text-bold">
              <div> {{ props.row.fields.customfield_10907 }} </div>
            </div>
            <div v-else>
              <q-icon name="horizontal_rule" color="negative"></q-icon>
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
              <q-icon name="horizontal_rule" size="sm" color="negative"></q-icon>
              <q-tooltip
                transition-show="scale"
                transition-hide="scale"
                class="bg-accent text-white text-bold"
                anchor="bottom middle" self="top middle">
                <div v-for="sprint in props.row.fields.customfield_10105" :key="sprint">
                  {{sprint.split(',')[3].split('=')[1]}}
                </div>
              </q-tooltip>
            </div>
          </q-td>
          <q-td key="deliverySprint" :auto-width="true" :props="props">
            <div v-if="props.row.fields.customfield_10948 && props.row.fields.customfield_10948 != sprintDetail.sprint.name " class="flex items-center justify-center text-warning text-bold">
              {{props.row.fields.customfield_10948}}
            </div>
            <div v-else class="flex items-center justify-center text-bold">
              {{ sprintDetail.sprint.name }}
            </div>
          </q-td>
          <q-td key="priority" :auto-width="true" :props="props" v-if="false">
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
