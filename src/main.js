import Vue from "vue";
import App from "./App.vue";

//import 'bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';

import PerfectScrollbar from "vue2-perfect-scrollbar";
Vue.use(PerfectScrollbar);

import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import router from "./router";

import Vuex from "vuex";
Vue.use(Vuex);

import io from "socket.io-client";

Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    urlClient: "http://localhost:8080/",
/*     urlClient: "https://pixelmage-front.herokuapp.com/",
 */    socket: io("localhost:3001"),
    /*     socket: io("https://pixelmage-back.herokuapp.com"),*/
    connected: false,
    categories: ["TOUTES", "Disney", "Célébrités", "Anime", "Pokémon"],
    images: [
      { image: "roi_lion.jpg", reponse: "Le Roi Lion", categorie: "Disney" },
      { image: "hercule.jpg", reponse: "Hercule", categorie: "Disney" },
      {
        image: "mister_jack.jpg",
        reponse: "L'étrange Noël de Monsieur Jack",
        categorie: "Disney",
      },
      {
        image: "reine_des_neiges.jpg",
        reponse: "La Reine des Neiges",
        categorie: "Disney",
      },
      {
        image: "le_bossu_de_notre_dame.jpg",
        reponse: "Le Bossu de Notre-Dame",
        categorie: "Disney",
      },
      {
        image: "malefique.jpg",
        reponse: "La Belle au Bois Dormant",
        categorie: "Disney",
      },
      { image: "raiponce.jpg", reponse: "Raiponce", categorie: "Disney" },
      { image: "peter_pan.jpg", reponse: "Peter Pan", categorie: "Disney" },
      { image: "bambi.jpg", reponse: "Bambi", categorie: "Disney" },
      {
        image: "101_dalmatiens.jpg",
        reponse: "101 dalmatiens",
        categorie: "Disney",
      },
      //{ image: "Capture.jpg", reponse: "OverAngelix & co", categorie: "Célébrités" },
      {
        image: "gilbert_montagne.jpg",
        reponse: "Gilbert Montagné",
        categorie: "Célébrités",
      },
      {
        image: "zidane.jpg",
        reponse: "Zinédine Zidane",
        categorie: "Célébrités",
      },
      { image: "at0mium.jpg", reponse: "At0mium", categorie: "Célébrités" },
      {
        image: "donald_trump.jpg",
        reponse: "Donald Trump",
        categorie: "Célébrités",
      },
      {
        image: "emmanuel_macron.jpg",
        reponse: "Emmanuel Macron",
        categorie: "Célébrités",
      },
      {
        image: "florent_pagny.jpg",
        reponse: "Florent Pagny",
        categorie: "Célébrités",
      },
      {
        image: "franck_ribery.jpg",
        reponse: "Franck Ribéry",
        categorie: "Célébrités",
      },
      { image: "jul.jpg", reponse: "JUL", categorie: "Célébrités" },
      { image: "vianney.jpg", reponse: "Vianney", categorie: "Célébrités" },
      { image: "nagui.jpg", reponse: "Nagui", categorie: "Célébrités" },
      {
        image: "mohamed_henni.jpg",
        reponse: "Mohamed Henni",
        categorie: "Célébrités",
      },
    ],
  },
  mutations: {
    connection(state) {
      state.connected = true;
    },
  },
});

/* CATEGORIE ANIME */

let animes = require("./assets/animes.json");
animes = animes.filter(
  (e) => e.difficulty == "easy" || e.difficulty == "medium"
);
store.state.images = [...store.state.images, ...animes];

/* CATEGORIE POKEMON */

const pokemons = require("./assets/pokemons.json");
pokemons.forEach((e) => {
  store.state.images.push({
    image: e.image,
    reponse: e.name,
    synonyms: [e.aliase],
    categorie: "Pokémon",
  });
});

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
