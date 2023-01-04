import {ref} from 'vue';
import {throttle} from "quasar";

export const uniqueItemKey = ref<string>('')
export const currentPosition = ref(0)

export function isActivate(path: string, link: string) {
    return path.concat(link) === uniqueItemKey.value
}

export function onScroll(pos: number) {
    currentPosition.value = pos
    console.log(currentPosition.value)
}

export const throttleOnScroll = throttle(onScroll, 500)