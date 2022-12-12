<script setup>
import { defineProps, ref, toRefs } from 'vue'

const layout = ref('dense')
const side = ref('right')

const TOTAL_SPRINT_WEEKS = 5

const props = defineProps({
  remainingWeekNumber: Number
})
const { remainingWeekNumber } = toRefs(props)

const currentWeek = TOTAL_SPRINT_WEEKS - remainingWeekNumber.value

const getClass = (week) => {
  const obj = week === currentWeek ? 'text-positive' : null
  return obj
}
</script>

<template>
  <div class="q-ml-md">
    <span class="text-h5">Sprint Timeline</span>
    <q-timeline :layout="layout" :side="side" color="secondary">
      <q-timeline-entry
        title="Design"
        subtitle="Week 1"
        :class="getClass(1)"
        side="left"
      >
      </q-timeline-entry>

      <q-timeline-entry
        title="Development"
        subtitle="Week 2"
        :class="getClass(2)"
        side="left"
      >
      </q-timeline-entry>

      <q-timeline-entry
        title="Development"
        subtitle="Week 3"
        :class="getClass(3)"
        side="left"
      >
      </q-timeline-entry>

      <q-timeline-entry
        title="Development"
        subtitle="Week 4"
        :class="getClass(4)"
        side="right"
      >
      </q-timeline-entry>

      <q-timeline-entry
        title="Test"
        subtitle="Week 5"
        :class="getClass(5)"
        side="right"
      >
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<style scoped>

</style>
