<template>
    <q-drawer
            v-model="outlineDrawer"
            :mini="!outlineDrawer || miniState"
            @mouseenter="miniState = false"
            @mouseleave="miniState = true"
            side="right"
            show-if-above
            mini-to-overlay
            bordered
    >
        <q-scroll-area class="fit">
            <q-list padding>
                <q-item>
                    <q-item-section class="text-h5">
                        目录
                    </q-item-section>
                </q-item>
                <OutlineItem :headers="headers"/>
            </q-list>
        </q-scroll-area>
    </q-drawer>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {onContentUpdated, useData, useRoute} from 'vitepress'
import OutlineItem from './OutlineItem.vue'
import {getHeaders} from '../composables/outline'
import {outlineDrawer, miniState} from '../composables/store'

const headers = ref([])
const route = useRoute();
const {theme} = useData()
onContentUpdated(() => {
    headers.value = getHeaders(theme.value.outline)
})
</script>