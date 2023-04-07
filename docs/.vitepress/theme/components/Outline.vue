<template>
    <div class="q-pa-md">
        <q-drawer
                v-model="drawer"
                :mini="!drawer || miniState"
                @click.capture="normalMode"
                @mouseenter="normalMode"
                @mouseleave="miniMode"
                show-if-above
                mini-to-overlay
                bordered
                side="right"
        >
            <template v-slot:mini>
                <q-scroll-area class="fit mini-slot cursor-pointer">
                    <div class="flex flex-center" style="height: 100vh;">
                        <q-btn icon="drag_indicator" flat/>
                    </div>
                </q-scroll-area>
            </template>

            <q-scroll-area class="fit">
                <q-list padding>
                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="toc"/>
                        </q-item-section>

                        <q-item-section class="text-h5">
                            目录
                        </q-item-section>
                    </q-item>
                    <OutlineItem :headers="headers"/>
                </q-list>
            </q-scroll-area>
        </q-drawer>
    </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import {onContentUpdated, useData} from 'vitepress';
import OutlineItem from './OutlineItem.vue';
//todo item自动定位，点击后调转到对应标题
import {outlineDraw} from '../composables/store'
import {getHeaders} from '../composables/outline';

const headers = ref([])

const {theme} = useData()
onContentUpdated(() => {
    headers.value = getHeaders(theme.value.outline)
})

const miniState = ref(true)
const drawer = ref(false)

function normalMode(e: Event) {
    // if in "mini" state and user
    // click on drawer, we switch it to "normal" mode
    if (miniState.value) {
        miniState.value = false

        // notice we have registered an event with capture flag;
        // we need to stop further propagation as this click is
        // intended for switching drawer to "normal" mode only
        e.stopPropagation()
    }
}

function miniMode() {
    miniState.value = true
}
</script>