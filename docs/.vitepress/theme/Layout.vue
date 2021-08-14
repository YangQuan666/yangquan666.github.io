<template>
  <v-app :theme="theme">
    <v-navigation-drawer v-model="drawer" app>
      <v-list nav dense>
        <v-list-item>
          <v-icon>mdi-home</v-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-icon>mdi-account</v-icon>
          <v-list-item-title>Account</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      shrink-on-scroll
      prominent
      src="https://picsum.photos/200/300/?blur"
      fade-img-on-scroll
      app
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>Application</v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon @click="toggleTheme">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <ul>
          <li v-for="item in page.headers" :key="item">
            <a :href="'#' + item.slug">{{ item.title }}</a>
          </li>
        </ul>
        <Content />
      </v-container>
    </v-main>

    <!--footer-->
    <v-footer app>
      <span>&copy; {{ new Date() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { ref } from "vue";
import { useData } from "vitepress";
export default {
  data: () => ({
    drawer: null,
  }),
  setup() {
    const theme = ref();
    const { page } = useData();

    return {
      page,
      theme,
      toggleTheme: () =>
        (theme.value = theme.value === "light" ? "dark" : "light"),
    };
  },
  methods: {},
};
</script>