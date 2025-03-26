<template>
    <div class="text-center text-h4 font-weight-bold ma-10">历史上今天都发生了什么？</div>
    <v-timeline side="end">
        <v-timeline-item v-for="({ year, title, link, desc }, i) in today" size="small" dot-color="primary">
            <template v-slot:opposite v-if="!display.mobile.value">
                <div class="pt-1 headline font-weight-bold" v-text="year + '年'"></div>
            </template>
            <v-card variant="text">
                <div class="text-h6 font-weight-bold v-card-text" v-html="title"></div>
                <v-card-subtitle v-if="display.mobile.value">{{ year + '年' }}</v-card-subtitle>
                <v-card-text v-html="desc"></v-card-text>
                <v-card-actions>
                    <v-btn text :href="link" color="primary">更多</v-btn>
                </v-card-actions>
            </v-card>
        </v-timeline-item>
    </v-timeline>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { ref } from 'vue'

const display = useDisplay()
const today = ref([])

const fetchData = async () => {
    const date = new Date()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = (date.getDate()).toString().padStart(2, '0')
    var data 
    try {
        const response = await fetch(`https://baike.baidu.com/cms/home/eventsOnHistory/${month}.json`)
        if (!response.ok) throw new Error('请求失败')
        data = await response.json();
    } catch (err) {
        console.log(err)
    }
    today.value = data[month][month + day]
}
fetchData()
</script>