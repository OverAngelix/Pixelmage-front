<template>
  <v-container fluid>
    <v-layout  justify-center>
      <v-flex xs12 md12>
        <v-card>
          <div
            v-if="drawGame && myTimer >= 1"
            class="
              offset-md-2
              col-md-8
              offset-md-2
              bg-warning
              mt-3
              mb-3
              text-center
            "
          >
            {{ response }} {{ myTimer }}
          </div>
          <div
            v-if="drawGame && myTimer >= 1"
            class="offset-md-2 col-md-8 offset-md-2 pl-0 pr-0"
          >
            <div class="row justify-content-md-center">
              <canvas id="canvas" class="img-fluid" />
            </div>
          </div>
          <div v-else class="offset-md-2 col-md-8 offset-md-2 pl-0 pr-0">
            <div>
              <table
                class="table table-bordered bg-light mt-4"
                style="text-align: center"
              >
                <tr>
                  <td>Position</td>
                  <td>Pseudo</td>
                  <td>Score</td>
                </tr>
                <tr v-for="(personne, index) in listePersonnes" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ personne.user }}</td>
                  <td>{{ personne.score }}</td>
                </tr>
              </table>
            </div>
          </div>
          <canvas hidden id="canvasInvisible" class="img-fluid" />
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>



<script>
function eight(image, scale) {
  scale *= 0.01;

  var canvas2 = document.getElementById("canvasInvisible");
  var canvas = document.getElementById("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  canvas2.width = image.width;
  canvas2.height = image.height;

  var scaledW = canvas.width * scale;
  var scaledH = canvas.height * scale;

  var ctx = canvas.getContext("2d");
  var ctx2 = canvas2.getContext("2d");
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
  ctx2.clearRect(0, 0, scaledW, scaledH);
  ctx.clearRect(0, 0, scaledW, scaledH);
  ctx2.drawImage(image, 0, 0, scaledW, scaledH);
  ctx.drawImage(
    canvas2,
    0,
    0,
    scaledW,
    scaledH,
    0,
    0,
    image.width,
    image.height
  );
  ctx.canvas.width  = 200;
  ctx.canvas.height = 200;
}

function compare(a, b) {
  if (a.score < b.score) {
    return 1;
  }
  if (a.score > b.score) {
    return -1;
  }
  return 0;
}

export default {
  data() {
    return {
      myImageIndex: -1,
      myTimer: 0,
      timeRound: 60,
      timeFinalRound: 65,
      response: "",
      room: "",
      drawGame: true,
      listePersonnes: [],
    };
  },
  props: ["host"],
  created() {
    this.room = this.$route.query.room;
  },
  methods: {
    pixelateImage(intesite) {
      var img = new Image();
      if (this.myTimer < this.timeRound) {
        img.onload = function () {
          eight(img, intesite);
        };
        const image = this.$store.state.images[this.myImageIndex].image;
        if (image.startsWith("http")) {
          img.src = image;
          img.style.width = "100px";
        } else {
          img.src = require("../assets/images/" + image);
        }
      }
      if (
        this.myTimer >= this.timeRound &&
        this.myTimer < this.timeFinalRound
      ) {
        img.onload = function () {
          eight(img, 50);
        };
        const image = this.$store.state.images[this.myImageIndex].image;
        if (image.startsWith("http")) {
          img.src = image;
        } else {
          img.src = require("../assets/images/" + image);
        }
      } else if (this.myTimer >= this.timeRound) {
        this.$store.state.socket.emit("newRound", {
          imagessize: this.$store.state.images.length,
          images: this.$store.state.images,
          room: this.room,
          host: this.host,
        });
      }
    },
    replaceAllCharacter(chaine) {
      let hiddenResponse = "";
      for (var i = 0; i < chaine.length; i++) {
        if (chaine.charAt(i) == "'") {
          hiddenResponse += "' ";
        } else if (chaine.charAt(i) == "-") {
          hiddenResponse += "- ";
        } else if (chaine.charAt(i) != " ") {
          hiddenResponse += "__ ";
        } else {
          hiddenResponse += "\xa0\xa0\xa0\xa0";
        }
      }
      return hiddenResponse;
    },
  },

  mounted() {
    this.$store.state.socket.on("pixeliserImage", (data) => {
      this.myTimer = data.imageprogress;
      this.myImageIndex = data.imageselected;
      if (this.room !== undefined) {
        this.$store.state.socket.emit("reponseImage", {
          reponseImage: this.$store.state.images[this.myImageIndex].reponse,
          synonyms: this.$store.state.images[this.myImageIndex].synonyms || [],
          room: this.room,
        });
      }
      if (
        this.myTimer >= this.timeRound &&
        this.myTimer <= this.timeFinalRound
      ) {
        this.response = this.$store.state.images[this.myImageIndex].reponse;
      } else {
        this.response = this.replaceAllCharacter(
          this.$store.state.images[this.myImageIndex].reponse
        );
      }
    });
    this.$store.state.socket.on("toutLeMondeATrouve", () => {
      this.myTimer = this.timeRound;
    });

    this.$store.state.socket.on("partyFinish", () => {
      this.drawGame = false;
    });

    this.$store.state.socket.on("partyBegin", () => {
      this.myTimer = 0;
      this.response = "";
      this.drawGame = true;
    });

    this.$store.state.socket.on("afficherLeaderboard", (data) => {
      this.listePersonnes = data;
      this.listePersonnes.sort(compare);
    });
  },

  watch: {
    myTimer(newTimer) {
      this.pixelateImage(newTimer / 8 + 0.5);
    },
  },
};
</script>

<style >
</style>
