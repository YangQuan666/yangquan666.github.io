<template>
    <q-toolbar>
        <q-btn flat round icon="menu" @click="$emit('updateDrawer')"/>

        <q-toolbar-title
            shrink
            class="row items-center no-wrap"
            @click="route.path !== '/' ? router.go('/') : undefined"
        >
          <q-avatar>
            <img src="/logo.svg" alt="logo" class="image-container">
          </q-avatar>
          <span class="q-ml-sm" v-if="$q.screen.gt.xs || searchClose">{{ site.title }}</span>
        </q-toolbar-title>
        <q-space/>
        <Search/>
        <q-space class="gt-sm"/>
        <q-btn v-if="isPost" @click="toggleMiniDrawer" icon="toc" flat round/>
    </q-toolbar>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useQuasar} from 'quasar'
import {useData, useRoute, useRouter} from 'vitepress'
import {isPost, searchClose, toggleMiniDrawer} from '../composables/store'
import Search from './Search.vue'

const $q = useQuasar()
const {site} = useData()
const router = useRouter()
const route = useRoute()
const keyword = ref('')
</script>
<style scoped>

</style>