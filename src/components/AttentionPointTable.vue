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
  rowsPerPage: 7
})

</script>

<template>
  <div v-if="issues && issues.length > 0 && sprintDetail && sprintDetail.sprint.name">
    <q-table
      :rows="[
      ]"
      separator="cell"
      :columns="columns.attentionPointColumns"
      bordered
      hide-bottom
      flat
      square
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
          <q-td key="key" :auto-width="false"  :props="props" class="text-bold">
            <a :href="'https://jira.skylogic.com:8443/browse/' + props.row.key" target="_blank">{{ props.row.key }}</a>
          </q-td>
          <q-td key="description" :auto-width="false" :props="props">
            <div>
              {{ props.row.description}}
            </div>
          </q-td>
          <q-td key="blocking" :auto-width="false" :props="props" class="text-uppercase text-bold">
            {{props.row.blocking}}
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
