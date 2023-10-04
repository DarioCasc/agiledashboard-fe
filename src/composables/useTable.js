import { computed, ref } from 'vue'

export default function useTable () {
  const columns = ref({
    issueColumns: [
      { name: 'key', label: 'KEY', align: 'center', format: val => `${val}` },
      // { name: 'summary', label: 'SUMMARY', align: 'center', format: val => `${val}` },
      { name: 'status', label: 'STATUS', align: 'center', format: val => `${val}` },
      // { name: 'issuelinks', label: 'LINK', align: 'center', format: val => `${val}` },
      { name: 'totalStoryPoints', label: 'Total SP', align: 'center', format: val => `${val}` },
      { name: 'remainingStoryPoints', label: 'Sprint SP', align: 'center', format: val => `${val}` },
      { name: 'team', label: 'TEAM', align: 'center', format: val => `${val}` },
      { name: 'sprintList', label: 'New', align: 'center', format: val => `${val}` },
      { name: 'deliverySprint', label: 'Delivery', align: 'center', format: val => `${val}` }
      // { name: 'priority', label: 'PRIORITY', align: 'center', format: val => `${val}` }
    ],
    attentionPointColumns: [
      { name: 'key', label: 'KEY', align: 'center', format: val => `${val}` },
      { name: 'description', label: 'DESCRIPTION', align: 'center', format: val => `${val}` },
      { name: 'blocking', label: 'BLOCKING', align: 'center', format: val => `${val}` }
    ]
  })

  return {
    columns: computed(() => columns.value)
  }
}
