<template>
  <v-app id="inspire">
    <v-container fluid>
      <v-layout v-resize="onResize" mt-10 justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="user"
                  name="user"
                  label="Username"
                  type="text"
                  class="form-control"
                ></v-text-field>
                <v-text-field
                  v-model="room"
                  id="room"
                  name="room"
                  label="Salon"
                  type="text"
                  class="form-control"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="connexion">Rejoindre la partie</v-btn>
            </v-card-actions>
          </v-card>

          <perfect-scrollbar id="ps-container">
            <v-card
              class="mt-10 elevation-12 mx-auto"
              flat
              tile
              outlined
            >
              <v-toolbar dense>
                <v-spacer />
                <v-toolbar-title>SALONS</v-toolbar-title>
                <v-spacer />
              </v-toolbar>

              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Salon</th>
                      <th class="text-left">Nb de joueurs</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(informations, index) in informationsSalles"
                      :key="index"
                    >
                      <td>{{ informations.salon }}</td>
                      <td>{{ informations.personnesParSalon }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </perfect-scrollbar>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      user: "",
      room: "",
      informationsSalles: [],
    };
  },

  methods: {
    onResize() {
      this.windowSize = {
        x: window.innerWidth - 90,
        y: window.innerHeight - 90,
      };
    },

    connexion(e) {
      e.preventDefault();
      if (this.user != "" && this.room != "") {
        this.$store.state.socket.emit("connexionServeur", {
          user: this.user,
          score: 0,
          dejaRepondu: false,
          room: this.room,
          host: false,
          windowSize: {
            x: 0,
            y: 0,
          },
        });
      }
    },
  },

  mounted() {
    this.onResize();

    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("room")) {
      this.room = urlParams.get("room");
    }
    if (localStorage.username) {
      this.user = localStorage.username;
    }
    this.$store.state.socket.on("accessDenied", (data) => {
      if (this.user == data) {
        alert(
          "Ce pseudo est déjà présent dans la partie ! Veuillez le changer."
        );
      }
    });

    this.$store.state.socket.on("accessAuthorized", () => {
      localStorage.username = this.user;
      this.$store.commit("connection");
      this.$router.push({ path: "/game", query: { room: this.room } });
    });

    this.$store.state.socket.emit("getSalonsCrees", () => {});

    this.$store.state.socket.on("envoiSalonsCrees", (data) => {
      this.informationsSalles = data;
    });
  },
};
</script>


