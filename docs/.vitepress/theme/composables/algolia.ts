import algoliasearch from 'algoliasearch'
import {name} from '../../../../package.json'

const client = algoliasearch('62QCDY1RP0', '5dd74cb6aebd52dc20601d741451039d')

const index = client.initIndex(name)

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

fetch('https://alg.li/doc-ecommerce.json')
    .then(function (response) {
        return response.json()
    })
    .then(function (products) {
        return index.saveObjects(products, {
            autoGenerateObjectIDIfNotExist: true
        })
    })