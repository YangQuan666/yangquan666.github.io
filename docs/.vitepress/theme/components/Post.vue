<template>
  <q-parallax :height="300">
    <template v-slot:media>
      <img src="https://cdn.quasar.dev/img/parallax2.jpg" alt="background">
    </template>

    <template v-slot:content="scope">
      <div class="absolute column items-center">
        <h2 class="text-white">
          “Talk is cheap. Show me the code.”
        </h2>
      </div>
    </template>
  </q-parallax>

  <q-markdown :src="mdStr">
  </q-markdown>
  <Content/>
</template>
<script setup>
import {useMeta} from 'quasar'
import pkg from '@quasar/quasar-ui-qmarkdown'
const {QMarkdown} = pkg

//todo 搜索引擎优化
const metaData = {}
useMeta(metaData)

const mdStr = ""


</script>
<style src="@quasar/quasar-ui-qmarkdown/dist/index.css"></style>