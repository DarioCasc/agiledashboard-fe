<script setup>
import { defineProps, ref, toRefs } from 'vue'

const layout = ref('dense')
const side = ref('right')

const TOTAL_SPRINT_WEEKS = 5

const props = defineProps({
  remainingWeekNumber: Number,
  startDate: Date,
  endDate: Date
})
const { remainingWeekNumber } = toRefs(props)

const currentWeek = TOTAL_SPRINT_WEEKS - remainingWeekNumber.value

const getClass = (week) => {
  const obj = (week === currentWeek) || (week === 1 && currentWeek === 0) ? 'text-positive' : null
  return obj
}
</script>

<template>
  <div class="q-ml-md">
    <div class="column">
      <div class="text-h5">Sprint Timeline</div>
      <div class="text-bold text-secondary">{{startDate}} - {{endDate}}</div>
    </div>
    <q-timeline :layout="layout" :side="side" color="secondary">
      <q-timeline-entry
        title="Design"
        subtitle="Week 1"
        :class="getClass(1)"
        side="left"
        tag="span"
      >
      </q-timeline-entry>

      <q-timeline-entry
        title="Development"
        subtitle="Week 2"
        :class="getClass(2)"
        tag="span"
        side="left"
      >
      </q-timeline-entry>

      <q-timeline-entry
        title="Development"
        subtitle="Week 3"
        :class="getClass(3)"
        side="left"
        tag="span"
      >
      </q-timeline-entry>

      <q-timeline-entry
        title="Development"
        subtitle="Week 4"
        :class="getClass(4)"
        side="right"
        tag="span"
      >
      </q-timeline-entry>

      <q-timeline-entry
        title="Test"
        subtitle="Week 5"
        :class="getClass(5)"
        side="right"
        tag="span"
      >
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<style scoped>

</style>
