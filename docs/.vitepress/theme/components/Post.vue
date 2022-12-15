<template>
  <q-parallax :height="300">
    <template v-slot:media>
      <img src="/default.svg" alt="background">
    </template>

    <template v-slot:content="scope">
      <div class="absolute column items-center">
        <h2>“Talk is cheap. Show me the code.”</h2>
      </div>
    </template>
  </q-parallax>

  <Content/>

</template>
<script setup>
import {useMeta} from 'quasar'
//todo 搜索引擎优化
const metaData = {}
useMeta(metaData)
</script>