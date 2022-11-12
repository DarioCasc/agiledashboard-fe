<script setup>
import { ref, onMounted } from 'vue'
import useAgileDashboard from 'src/composables/useAgileDashboard'

const leftDrawerOpen = ref(false)
const { getListOfProject } = useAgileDashboard()

const sectionOne = [
  { icon: 'apps', text: 'Projects', goTo: '/' }
]

onMounted(async () => {
  await getListOfProject()
})

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<template>
  <transition name="fade" mode="out-in">
    <q-layout view="lHh lpR fFf">
      <q-header elevated class="bg-primary text-white" height-hint="64">
        <q-toolbar class="ADB__toolbar">
          <q-btn
            flat
            dense
            round
            @click="toggleLeftDrawer"
            aria-label="Menu"
            icon="menu"
            class="q-mr-sm"
          />

          <q-toolbar-title v-if="$q.screen.gt.xs" shrink class="row items-center no-wrap">
            <span class="q-ml-sm">Agile Dashboard</span>
          </q-toolbar-title>

          <q-space />

          <div class="q-gutter-sm row items-center no-wrap">
            <q-btn v-if="$q.screen.gt.sm" round dense flat color="white" icon="apps" to="/">
              <q-tooltip class="bg-accent">Dashboard</q-tooltip>
            </q-btn>
            <q-btn round flat>
              <q-avatar size="26px">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
              </q-avatar>
              <q-tooltip class="bg-accent">Account</q-tooltip>
            </q-btn>
          </div>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="leftDrawerOpen"
        elevated
        class="bg-secondary"
        :width="280"
      >
        <q-scroll-area class="fit">
          <q-list padding class="text-white">
            <q-item class="ADB__drawer-item" v-ripple v-for="link in sectionOne" :key="link.text" :to="link.goTo" clickable>
              <q-item-section avatar>
                <q-icon :name="link.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ link.text }}</q-item-label>
              </q-item-section>
            </q-item>

          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container style="background-color: #f4f5fa">
          <router-view />
      </q-page-container>
    </q-layout>
  </transition>
</template>

<style lang="sass">
.ADB

  &__toolbar
    height: 64px

  &__toolbar-input
    width: 55%

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      .q-icon
        color: white

    .q-item__label
      color: white
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem

    &:hover
      color: #000
</style>
