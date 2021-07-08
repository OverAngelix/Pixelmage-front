<template>
  <v-theme-provider root>
    <div id="app">
      <NavigationBar />
      <router-view />
    </div>
  </v-theme-provider>
</template>

<script>
import NavigationBar from "@/components/NavigationBar"

export default {
  name: "App",
  components: {
    NavigationBar
  },
  watch: {
    "$vuetify.theme.dark"() {
      localStorage.darkTheme = this.$vuetify.theme.dark;
    },
  },
  mounted() {
    if (localStorage.darkTheme === "true") {
      this.$vuetify.theme.dark = true;
    }
  },
};
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>



