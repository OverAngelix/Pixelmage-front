<template>
  <v-app id="inspire">
    <v-container fluid>
      <v-layout mt-5>
        <v-flex xs3 sm3 md3>
          <perfect-scrollbar id="ps-container">
            <v-card class="mx-auto" flat :height="windowSize.y" outline>
              <v-navigation-drawer floating permanent>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="text-h6">
                      Liste des joueurs
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>

                <v-list dense nav>
                  <v-list-item
                    v-for="(personne, index) in listePersonne"
                    :key="index"
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{ personne.user }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ personne.score }}</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-navigation-drawer>
            </v-card>
          </perfect-scrollbar>

        </v-flex>
        <v-flex xs8 sm8 md8>
          <v-dialog
            v-if="host && partieCommencee != true"
            v-model="dialog"
            width="500"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
                Commencer
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="text-h5 grey lighten-2">
                Parametres de la partie
              </v-card-title>

              <v-card-text class="mt-5">
                <v-select
                  :items="categories"
                  item-text="id"
                  label="Catégories"
                  v-model="categorieSelected"
                  dense
                  outlined
                ></v-select>
                <v-select
                  :items="compteurRound"
                  label="Nombre de round"
                  v-model="maxRoundSelected"
                  dense
                  outlined
                ></v-select>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="
                    dialog = false;
                    lancerPartie();
                  "
                >
                  Valider la configuration
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <Game :host="host" />
        </v-flex>
        <v-flex xs2 sm2 md2>
          <perfect-scrollbar id="ps-container">
            <div class="messages" v-for="(msg, index) in messages" :key="index">
              <p>
                <span class="font-italic" v-if="msg.timeInfo"
                  >({{ msg.timeInfo }})
                </span>
                <span class="font-weight-bold" v-if="msg.user"
                  >{{ msg.user }}:
                </span>
                {{ msg.message }}
              </p>
            </div>

            <form @submit.prevent="sendMessage" class="row">
              <div class="gorm-group col-md-8 p-0">
                <input type="text" v-model="message" class="form-control" />
              </div>
              <button type="submit" class="btn btn-success col-md-4">
                Envoyer
              </button>
            </form>
          </perfect-scrollbar>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import Game from "../components/Game.vue";

export default {
  components: {
    Game,
  },
  data() {
    return {
      user: "",
      message: "",
      messages: [],
      listePersonne: [],
      dejaRepondu: false,
      room: "",
      host: false,
      partieCommencee: false,
      categorieSelected: "TOUTES",
      categories: [],
      compteurRound: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      maxRoundSelected: 10,
      dialog: false,
      windowSize: {
        x: 0,
        y: 0,
      },
    };
  },

  created() {
    window.addEventListener("beforeunload", this.beforeunloadFn);
    this.categories = this.$store.state.categories;
    this.room = this.$route.query.room;
    if (this.$store.state.connected == false) {
      const params = window.location.search;
      this.$router.push("/connexion" + params);
    }
  },

  destroyed() {
    window.removeEventListener("beforeunload", this.beforeunloadFn);
  },

  beforeRouteLeave(to, from, next) {
    this.beforeunloadFn();
    next();
  },

  methods: {
    onResize() {
      this.windowSize = {
        x: window.innerWidth - 90,
        y: window.innerHeight - 90,
      };
    },

    lancerPartie() {
      if (this.room !== undefined) {
        this.$store.state.socket.emit("lancementChrono", {
          categorie: this.categorieSelected,
          imagessize: this.$store.state.images.length,
          images: this.$store.state.images,
          room: this.room,
        });
        this.$store.state.socket.emit("envoiMaxRound", {
          maxRound: this.maxRoundSelected,
          room: this.room,
        });
        this.$store.state.socket.emit("majPartieCommencee1", {
          room: this.room,
          categorie: this.categorieSelected,
        });
      }
    },

    beforeunloadFn() {
      this.$store.state.socket.emit("deconnexionServeur", {
        user: this.user,
        room: this.room,
      });
    },

    scrollToEnd() {
      setTimeout(() => {
        const container = document.getElementById("ps-container");
        container.scrollTop = container.scrollHeight;
      }, 0);
    },

    currentTime() {
      let today = new Date();
      let hours = today.getHours();
      let minutes = today.getMinutes();
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      return hours + ":" + minutes;
    },

    sendMessage(e) {
      if (this.message != "" && this.user != "" && !this.dejaRepondu) {
        e.preventDefault();

        this.$store.state.socket.emit("SEND_MESSAGE", {
          user: this.user,
          message: this.message,
          timeInfo: this.currentTime(),
          dejaRepondu: this.dejaRepondu,
          room: this.room,
        });
        this.message = "";
      }
    },
  },

  mounted() {
    this.onResize();

    this.$store.state.socket.on("MESSAGE", (data) => {
      this.messages = [...this.messages, data];
      this.scrollToEnd();
    });

    this.$store.state.socket.on("partyFinish", () => {
      this.partieCommencee = false;
    });

    if (localStorage.username) {
      this.user = localStorage.username;
    }

    this.$store.state.socket.emit("envoiInfosServeur", {
      room: this.room,
    });

    this.$store.state.socket.on("miseAJourChat", (data) => {
      this.messages = [];
      for (let i = 0; i < data.length; i++) {
        this.messages = [...this.messages, data[i]];
      }
    });

    this.$store.state.socket.on("RAZ", () => {
      this.dejaRepondu = false;
    });

    this.$store.state.socket.on("miseAJourPersonnes", (data) => {
      this.listePersonne = data;
      this.host = data.filter((e) => e.user == this.user)[0].host;
      this.score = data.filter((e) => e.user == this.user)[0].score;
      this.dejaRepondu = data.filter((e) => e.user == this.user)[0].dejaRepondu;
    });

    this.$store.state.socket.on("miseAJourScore", (data) => {
      this.listePersonne = data;
    });

    this.$store.state.socket.on("miseAJourRepondus", (data) => {
      if (this.user == data.user) {
        this.dejaRepondu = true;
      }
    });

    this.$store.state.socket.on("majPartieCommencee2", (data) => {
      this.partieCommencee = true;
      this.categorieSelected = data.categorie;
    });
  },
};
</script>

<style>
.ps{
  height: 700px;
}

.listePersonnes {
  display: inline-block;
  margin: 0;
  padding: 0;
  text-align: center;
}

</style>
