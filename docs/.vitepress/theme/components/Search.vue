<template>

    <div
            class="search-field"
            v-bind:class='{ "search-closed": searchClose}'
    >
        <ais-instant-search :index-name="indexName" v-bind:search-client="searchClient">
            <ais-autocomplete>
                <template v-slot="{ currentRefinement, indices, refine }">
                    <q-select
                            v-model="model"
                            @input-value="(value) => refine(value)"
                            :options="getOptions(currentRefinement, indices)"
                            :option-label="opt => opt.title"
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
                            <q-separator v-if="scope.index > 0" spaced inset/>

                            <q-item v-bind="scope.itemProps" @click="router.go(scope.opt.link)">
                                <q-item-section>
                                    <q-item-label>{{ scope.opt.title }}</q-item-label>
                                    <q-item-label caption lines="2">{{ scope.opt.excerpt }}</q-item-label>
                                </q-item-section>

                                <q-item-section side>
                                    <q-item-label caption>
                                        {{ date.formatDate(scope.opt.lastUpdated, 'YYYY-MM-DD') }}
                                    </q-item-label>
                                </q-item-section>
                            </q-item>
                        </template>
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
import {date} from 'quasar'

const router = useRouter()
const searchClose = ref(true)

const model = ref('')

const getOptions = computed(() => (currentRefinement, indices) => {

    if (!currentRefinement) {
        return []
    }
    const opt = indices[0].hits || []
    return opt.sort((a, b) => b.lastUpdated - a.lastUpdated)

})

</script>