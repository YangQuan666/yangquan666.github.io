import {reactive, ref} from 'vue'
// 全局状态，创建在模块作用域下
const globalCount = ref(1)

export function useCount() {
    // 局部状态，每个组件都会创建
    const localCount = ref(1)

    return {
        globalCount,
        localCount
    }
}

export const store = reactive({
    count: 0
})