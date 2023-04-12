<template>
    <q-toolbar>
        <q-btn flat round icon="menu" @click="$emit('updateDrawer')"/>

        <q-toolbar-title
                shrink
                class="row items-center no-wrap"
        >
            <q-avatar>
                <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" alt="logo">
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
import {useData} from 'vitepress'
import {isPost, toggleMiniDrawer} from '../composables/store'
import Search from './Search.vue'

const $q = useQuasar()
const {site} = useData()
const searchClose = ref(true)

const keyword = ref('')
</script>