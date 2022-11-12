import { computed, ref } from 'vue'

export default function useTable () {
  const columns = ref({
    issueColumns: [
      { name: 'key', label: 'KEY', align: 'center', format: val => `${val}` },
      { name: 'summary', label: 'SUMMARY', align: 'center', format: val => `${val}` },
      { name: 'status', label: 'STATUS', align: 'center', format: val => `${val}` },
      { name: 'issuelinks', label: 'LINK', align: 'center', format: val => `${val}` },
      { name: 'storyPoints', label: 'SP', align: 'center', format: val => `${val}` },
      { name: 'team', label: 'TEAM', align: 'center', format: val => `${val}` },
      { name: 'priority', label: 'PRIORITY', align: 'center', format: val => `${val}` }
    ]
  })

  return {
    columns: computed(() => columns.value)
  }
}
