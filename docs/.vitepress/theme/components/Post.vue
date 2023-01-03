<template>
  <q-img src="/default.svg" height="400px" alt="background">
    <h3 class="absolute-full flex flex-center">
      When in doubt, use brute force.
    </h3>
  </q-img>
  <div class="row animate__animated animate__fadeIn">
    <!--todo 1.展示相关的标签，2.展示阅读需要的大概时间(根据字数估计)，3发表的时间-->
    <Content class="markdown-body col-12 col-sm-10 offset-sm-1" v-scroll="throttleOnScroll"/>
    <!--todo 增加 end 分隔符，或者提示"我也是有底线的" -->
    <!--todo 增加sponsor（请我喝杯咖啡）, 增加discussion，增加其他 -->
  </div>
  <Outline behavior="mobile" :headers="page.headers"/>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {throttleOnScroll} from "../composables/outline";
import {readingTime} from "../composables/common";
import {useData} from "vitepress";
import {store} from "../composables/store";
import Outline from "./Outline.vue";

const content = ref()
const {frontmatter, page} = useData()
const readTime = ref()

onMounted(() => {
  readTime.value = readingTime(content.value.$el);
})

console.log(store.count++)

//todo 搜索引擎优化
// const metaData = {}
// useMeta(metaData)
//todo cookie 记录浏览位置
</script>