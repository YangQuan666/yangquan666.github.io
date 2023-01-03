<template>
  <q-img src="/default.svg" height="400px" alt="background">
    <h3 class="absolute-full flex flex-center">
      When in doubt, use brute force.
    </h3>
  </q-img>
  <div class="row animate__animated animate__fadeIn">
    <div class="col-12 col-sm-10 offset-sm-1">

      <q-card-actions>
        <q-icon name="schedule"/>
        预计阅读{{ readTime }}分钟
        <q-space/>
        <q-icon name="publish"/>
        {{ date.formatDate(frontmatter.date, 'YYYY-MM-DD') }}发表
      </q-card-actions>

      <Content ref="content" v-scroll="throttleOnScroll" class="markdown-body"/>
      <!--todo 增加 end 分隔符，或者提示"我也是有底线的" -->
      <!--todo 增加sponsor（请我喝杯咖啡）, 增加discussion，增加其他 -->
    </div>
  </div>
  <Outline :headers="page.headers"/>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {throttleOnScroll} from "../composables/outline";
import {readingTime} from "../composables/common";
import {useData} from "vitepress";
import Outline from "./Outline.vue";
import {date} from "quasar";

const content = ref()
const {frontmatter, page} = useData()
const readTime = ref()

onMounted(() => {
  readTime.value = readingTime(content.value.$el);
})

//todo 搜索引擎优化
// const metaData = {}
// useMeta(metaData)
//todo cookie 记录浏览位置
</script>