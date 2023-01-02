import {ref} from 'vue';
import {throttle} from "quasar";

export const uniqueItemKey = ref(null)
export const currentPosition = ref(null)

const PAGE_OFFSET = 71;

export function getHeaders(pageOutline) {
    if (pageOutline === false)
        return [];
    let updatedHeaders = [];
    document
        .querySelectorAll('h2, h3, h4, h5, h6')
        .forEach((el) => {
            if (el.textContent && el.id) {
                updatedHeaders.push({
                    level: Number(el.tagName[1]),
                    title: el.innerText.replace(/\s+#\s*$/, ''),
                    link: `#${el.id}`
                });
            }
        });
    return resolveHeaders(updatedHeaders, pageOutline);
}

export function resolveHeaders(headers, levelsRange = 2) {
    const levels = typeof levelsRange === 'number'
        ? [levelsRange, levelsRange]
        : levelsRange === 'deep'
            ? [2, 6]
            : levelsRange;
    return groupHeaders(headers, levels);
}

function groupHeaders(headers, levelsRange) {
    const result = [];
    headers = headers.map((h) => ({...h}));
    headers.forEach((h, index) => {
        if (h.level >= levelsRange[0] && h.level <= levelsRange[1]) {
            if (addToParent(index, headers, levelsRange)) {
                result.push(h);
            }
        }
    });
    return result;
}

function addToParent(currIndex, headers, levelsRange) {
    if (currIndex === 0) {
        return true;
    }
    const currentHeader = headers[currIndex];
    for (let index = currIndex - 1; index >= 0; index--) {
        const header = headers[index];
        if (header.level < currentHeader.level &&
            header.level >= levelsRange[0] &&
            header.level <= levelsRange[1]) {
            if (header.children == null)
                header.children = [];
            header.children.push(currentHeader);
            return false;
        }
    }
    return true;
}

export function isActivate(path, link) {
    return path + link === uniqueItemKey.value
}

export function onScroll(pos) {
    currentPosition.value = pos
    console.log(currentPosition.value)
}

export const throttleOnScroll = throttle(onScroll, 500)