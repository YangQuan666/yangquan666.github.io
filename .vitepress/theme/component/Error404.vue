<script setup>

</script>

<template>
  <v-empty-state
      image="/astro-dog.svg"
      size="200"
      text-width="250"
  >
    <template v-slot:media>
      <v-img class="mb-8"></v-img>
    </template>

    <template v-slot:title>
      <div class="text-h6 text-high-emphasis">Empty in drafts</div>
    </template>

    <template v-slot:text>
      <div class="text-body-1">
        Save a draft message and it will show up here
      </div>
    </template>
  </v-empty-state>
</template>