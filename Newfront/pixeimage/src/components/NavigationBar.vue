<template>
  <v-card flat tile  outlined>
    <v-toolbar dense>
      <v-btn icon>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-toolbar-title>PixeImage</v-toolbar-title>
           <v-spacer></v-spacer>
      <BaseSwitchTheme class="switch-theme" />
    </v-toolbar>
  </v-card>
</template>

<script>
import BaseSwitchTheme from "@/components/BaseSwitchTheme"

export default {
  name: "NavigationBar",
    components: {
    BaseSwitchTheme
  },
}
</script>
