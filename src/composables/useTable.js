import { computed, ref } from 'vue'

export default function useTable () {
  const columns = ref({
    issueColumns: [
      { name: 'key', label: 'KEY', align: 'center', field: row => row.key, format: val => `${val}` },
      { name: 'summary', label: 'SUMMARY', align: 'center', field: row => row.fields.summary, format: val => `${val}` },
      { name: 'status', label: 'STATUS', align: 'center', field: row => row.fields.status, format: val => `${val}` },
      { name: 'issuelinks', label: 'LINK', align: 'center', field: row => row.fields.issuelinks, format: val => `${val}` },
      { name: 'priority', label: 'PRIORITY', align: 'center', field: row => row.fields.priority, format: val => `${val}` }
    ]
  })

  return {
    columns: computed(() => columns.value)
  }
}
