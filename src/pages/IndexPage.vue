<script setup>
import useHello from 'src/composables/useHello'
import { onMounted } from 'vue'

const { helloMessage, greeting } = useHello()

onMounted(async () => {
  await greeting()
})
</script>

<template>
  <q-page class="flex flex-center">
    <div>
      {{helloMessage}}
    </div>
  </q-page>
</template>
