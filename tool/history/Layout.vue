<template>
    <div class="text-center text-h4 font-weight-bold ma-10">历史上今天都发生了什么？</div>
    <div v-if="loading" class="d-flex justify-center ma-10">
        <v-progress-circular color="primary" indeterminate></v-progress-circular>
    </div>
    <v-alert v-else-if="error" type="error" variant="tonal" class="ma-4">
        {{ error }}
    </v-alert>
    <v-timeline side="end">
        <v-timeline-item v-for="({ year, title, link, desc }, i) in today" size="small" dot-color="primary">
            <template v-slot:opposite v-if="!display.mobile.value">
                <div class="pt-1 headline font-weight-bold" v-text="year + '年'"></div>
            </template>
            <v-card variant="text">
                <div class="text-h6 font-weight-bold v-card-text">{{ title }}</div>
                <v-card-subtitle v-if="display.mobile.value">{{ year + '年' }}</v-card-subtitle>
                <v-card-text>{{ desc }}</v-card-text>
                <v-card-actions>
                    <v-btn v-if="link" text :href="link" color="primary">更多</v-btn>
                </v-card-actions>
            </v-card>
        </v-timeline-item>
    </v-timeline>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { onMounted, ref } from 'vue'

const display = useDisplay()
const today = ref([])
const loading = ref(true)
const error = ref('')

const toPlainText = (value) => {
    const document = new DOMParser().parseFromString(String(value ?? ''), 'text/html')
    return document.body.textContent ?? ''
}

const toSafeLink = (value) => {
    try {
        const url = new URL(value)
        return url.protocol === 'https:' && url.hostname === 'baike.baidu.com' ? url.href : ''
    } catch {
        return ''
    }
}

const fetchData = async () => {
    const date = new Date()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = (date.getDate()).toString().padStart(2, '0')
    try {
        const response = await fetch(`https://baike.baidu.com/cms/home/eventsOnHistory/${month}.json`)
        if (!response.ok) throw new Error('请求失败')
        const data = await response.json()
        const events = data?.[month]?.[month + day] ?? []
        today.value = events.map(event => ({
            ...event,
            title: toPlainText(event.title),
            desc: toPlainText(event.desc),
            link: toSafeLink(event.link)
        }))
        if (today.value.length === 0) {
            error.value = '今天暂无历史事件数据'
        }
    } catch (err) {
        console.error(err)
        error.value = '历史事件数据加载失败，请稍后重试'
    } finally {
        loading.value = false
    }
}

onMounted(fetchData)
</script>
