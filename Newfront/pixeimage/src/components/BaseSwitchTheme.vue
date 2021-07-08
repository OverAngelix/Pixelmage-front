<template>
  <v-btn @click="switchTheme" class="contraste" fab small dark>
    <v-icon v-if="$vuetify.theme.dark" color="white">mdi-brightness-7</v-icon>
    <v-icon v-else color="white">mdi-brightness-3</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: "BaseSwitchTheme",
  mounted() {
    if (localStorage.darkTheme === "true") {
      this.$vuetify.theme.dark = true;
    }
  },
  methods: {
    switchTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.darkTheme = this.$vuetify.theme.dark;
    }
  }
};
</script>

<style scoped>
.contraste {
  transform: scaleX(-1);
}
</style>
