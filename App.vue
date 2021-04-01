<template>
  <div id="app">
    <Header></Header>
    <div v-if="user">
      <router-view></router-view>
    </div>
    <div v-else>
      <router-view name="notlogin"></router-view>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import ImportCsv from "./components/importcsv.vue";
import MusicList from "./components/musiclist.vue";
import Header from "./components/Header.vue";
//import AudienceView from '@/components/List.vue'

import Vue from "vue";

export default {
  name: "app",
  components: {
    ImportCsv,
    MusicList,
    Header,
  },
  data: () => ({
    //db:firebase.firestore(),
    user: Vue.prototype.user,
  }),
  created: async function () {
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
    });
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
