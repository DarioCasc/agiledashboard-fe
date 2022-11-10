<script setup>
import { defineProps, toRefs, ref } from 'vue'
import useTable from 'src/composables/useTable'

const props = defineProps({
  issues: Array
})
const { columns } = useTable()
const { issues } = toRefs(props)
const pagination = ref({
  rowsPerPage: 10
})

</script>

<template>
  <div class="q-pa-md">
    <q-table
      :rows="issues"
      separator="cell"
      :columns="columns.issueColumns"
      row-key="key"
      :pagination="pagination"
    >
      <template v-slot:top>
        <div class="flex items-center justify-between full-width">
          <div class="text-bold text-h6 text-uppercase text-primary text-center">Entities</div>
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
          <q-td key="key" :props="props">
            {{ props.row.key }}
          </q-td>
          <q-td key="summary" :props="props">
            {{ props.row.fields.summary }}
          </q-td>
          <q-td key="priority" :props="props">
            <div class="flex items-center justify-around">
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
