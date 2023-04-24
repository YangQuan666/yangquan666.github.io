<template>

    <div
            class="search-field"
            v-bind:class='{ "search-closed": searchClose}'
    >
        <ais-instant-search :index-name="indexName" v-bind:search-client="searchClient">
            <ais-autocomplete>
                <template v-slot="{ currentRefinement, indices, refine }">

                    <!--                    <q-input-->
                    <!--                            @blur="searchClose = true"-->
                    <!--                            @focus="searchClose = false"-->
                    <!--                            @update:model-value="(value) => {refine(value)}"-->
                    <!--                            :model-value="currentRefinement"-->
                    <!--                            type="search"-->
                    <!--                            clearable-->
                    <!--                            dark-->
                    <!--                            standout-->
                    <!--                            bottom-slots-->
                    <!--                            dense hide-bottom-space-->
                    <!--                    >-->
                    <!--                        <template #prepend>-->
                    <!--                            <q-icon name="search" class="cursor-pointer"></q-icon>-->
                    <!--                        </template>-->
                    <!--                        <template #hint>-->
                    <!--                            <div style="color: #00b0ff">aaaaaaaa</div>-->
                    <!--                        </template>-->
                    <!--                    </q-input>-->
                    <!--                    <ul v-if="currentRefinement" v-for="index in indices" :key="index.indexId">-->
                    <!--                        <h2> {{ index.hits.length }}</h2>-->
                    <!--                        <li>-->
                    <!--                            <h3>{{ index.indexName }}</h3>-->
                    <!--                            {{ index }}-->
                    <!--                        </li>-->
                    <!--                    </ul>-->


                    <q-select
                            v-model="model"
                            @input-value="(value) => refine(value)"
                            :options="getOptions(currentRefinement, indices)"
                            @blur="searchClose = true"
                            @focus="searchClose = false"
                            label="Search"
                            behavior="menu"
                            standout
                            use-input
                            hide-dropdown-icon
                    >
                        <template v-slot:append>
                            <q-icon name="search"/>
                        </template>
                        <template v-slot:option="scope">
                            <q-item v-bind="scope.itemProps" @click="router.go(scope.opt)">
                                {{ scope.opt }}
                            </q-item>
                        </template>
                        <!--                        <template v-slot:no-option>-->
                        <!--                            <q-item>-->
                        <!--                                <q-item-section class="text-grey">-->
                        <!--                                    No results-->
                        <!--                                </q-item-section>-->
                        <!--                            </q-item>-->
                        <!--                        </template>-->
                    </q-select>
                </template>
            </ais-autocomplete>
        </ais-instant-search>
    </div>
</template>

<script setup>
import {ref, computed} from 'vue';
import {useRouter} from 'vitepress'
import {indexName, searchClient} from '../composables/algolia'
import {AisAutocomplete, AisInstantSearch} from 'vue-instantsearch/vue3/es/index.js'

const router = useRouter()
const searchClose = ref(true)

const model = ref('')

const getOptions = computed(() => (currentRefinement, indices) => {

    if (!currentRefinement) {
        return []
    }
    return indices[0].hits || [];
})

</script>