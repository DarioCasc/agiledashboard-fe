<script setup>
import { defineProps, toRefs, ref } from 'vue'
import useTable from 'src/composables/useTable'

const props = defineProps({
  issues: Array,
  sprintDetail: Object
})
const { columns } = useTable()
const { issues, sprintDetail } = toRefs(props)
const pagination = ref({
  rowsPerPage: 10
})
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
        <div>
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
          <q-td key="key" :auto-width="true" :props="props">
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
             <q-icon name="close"></q-icon>
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
