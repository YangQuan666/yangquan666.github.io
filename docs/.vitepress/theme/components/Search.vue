<template>

    <div
            class="search-field"
            v-bind:class='{ "search-closed": searchClose}'
    >
        <ais-instant-search :index-name="indexName" v-bind:search-client="searchClient">
            <ais-autocomplete>
                <template v-slot="{ currentRefinement, indices, refine }">

                    <q-input
                            type="search"
                            dark
                            standout bottom-slots
                            placeholder="Search"
                            dense hide-bottom-space
                            @blur="searchClose = true"
                            @focus="searchClose = false"
                            @update:model-value="(value) => {refine(value)}"
                            :model-value="currentRefinement"
                    >
                        <template #prepend>
                            <q-icon name="search" class="cursor-pointer"></q-icon>
                        </template>
                    </q-input>

                    <ul v-if="currentRefinement" v-for="index in indices" :key="index.indexId">
                        <h2> {{ index.hits.length }}</h2>
                        <li>
                            <h3>{{ index.indexName }}</h3>
                            {{ index }}
                        </li>
                    </ul>
                </template>
            </ais-autocomplete>
        </ais-instant-search>
    </div>
</template>

<script setup>
import {ref} from 'vue';
import {indexName, searchClient} from '../composables/algolia'
import {AisAutocomplete, AisInstantSearch} from 'vue-instantsearch/vue3/es'

const searchClose = ref(true)

</script>