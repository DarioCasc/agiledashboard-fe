import { ApiFactory } from 'src/api/apiFactory'
const HelloService = ApiFactory.get('hello')
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'

const helloMessage = ref('')

export default function useHello () {
  const $q = useQuasar()

  async function greeting (queryParams) {
    $q.loading.show()
    const { data } = await HelloService.greeting(queryParams)
    helloMessage.value = data.message
    $q.loading.hide()
  }

  return {
    helloMessage: computed(() => helloMessage.value),
    greeting
  }
}
