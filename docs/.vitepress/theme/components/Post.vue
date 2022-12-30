<template>
  <q-parallax :height="300">
    <template v-slot:media>
      <img src="/default.svg" alt="background">
    </template>

    <template v-slot:content="scope">
      <div class="absolute column items-center">
        <h3>Simplicity is the soul of efficiency.</h3>
      </div>
    </template>
  </q-parallax>
  <div class="row animate__animated animate__fadeIn">
    <!--todo 1.展示相关的标签，2.展示阅读需要的大概时间(根据字数估计)，3发表的时间-->
    <Content class="markdown-body col-12 col-sm-10 offset-sm-1" :onContentUpdated="onContentUpdated"/>
    <!--todo 增加 end 分隔符，或者提示"我也是有底线的" -->
    <!--todo 增加sponsor（请我喝杯咖啡）, 增加discussion，增加其他 -->
  </div>
  <q-drawer
      show-if-above
      bordered
      side="right"
      v-model="draw"
  >
    <Outline :headers="headers"/>
  </q-drawer>

</template>
<script lang="ts" setup>
import {useData} from "vitepress";
import {provide, ref} from "vue";
import Outline from "./Outline.vue";

const {page} = useData()
const headers = ref([])

const draw = ref(false)
const onContentUpdated = ref()
provide('onContentUpdated', onContentUpdated)

//todo 搜索引擎优化
// const metaData = {}
// useMeta(metaData)
</script>