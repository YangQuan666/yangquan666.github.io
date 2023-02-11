import algoliasearch from 'algoliasearch'
import {name} from '../../../../package.json'
// import instantsearch from 'instantsearch.js';
import { searchBox, hits } from 'instantsearch.js/es/widgets';

// const client = algoliasearch('62QCDY1RP0', '5dd74cb6aebd52dc20601d741451039d')
const searchClient = algoliasearch('62QCDY1RP0', '5dd74cb6aebd52dc20601d741451039d');


const index = searchClient.initIndex(name)

index.setSettings({
    // Select the attributes you want to search in
    searchableAttributes: [
        'title', 'tags', 'excerpt'
    ],
    // Define business metrics for ranking and sorting
    customRanking: [
        'desc(lastUpdated)'
    ],
    // Set up some attributes to filter results on
    // attributesForFaceting: [
    //     'categories', 'searchable(brand)', 'price'
    // ]
});

export function buildIndex(json: any) {
    index.replaceAllObjects(json, {
        autoGenerateObjectIDIfNotExist: true
    })
}

// const search = instantsearch({
//     indexName: index.indexName,
//     searchClient,
// });

// search.addWidgets([
//     searchBox({
//         container: "#searchbox"
//     }),
//
//     hits({
//         container: "#hits"
//     })
// ]);

// search.start();