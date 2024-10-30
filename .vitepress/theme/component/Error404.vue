<script setup>

</script>

<template>
  <v-empty-state
      image="/astro-dog.svg"
  >
    <template v-slot:media>
      <v-img class="mb-8"></v-img>
    </template>

    <template v-slot:title>
      <div class="text-h6 text-high-emphasis">Page Not Found</div>
    </template>

    <template v-slot:text>
      <div class="text-body-1">
        The page you were looking for does not exist
      </div>
    </template>
  </v-empty-state>
</template>