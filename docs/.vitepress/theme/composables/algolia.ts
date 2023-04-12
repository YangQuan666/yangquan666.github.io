import algoliasearch from 'algoliasearch'
import {name} from '../../../../package.json'

export const indexName = name
export const searchClient = algoliasearch('62QCDY1RP0', '5dd74cb6aebd52dc20601d741451039d');


const searchIndex = searchClient.initIndex(name)

searchIndex.setSettings({
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
    // searchIndex.replaceAllObjects(json, {
    //     autoGenerateObjectIDIfNotExist: true
    // })
}