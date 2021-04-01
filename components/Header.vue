<template>
  <div id="Header">    
    <b-navbar type="light" variant="light">
      <b-navbar-brand href="/">レパートリー管理</b-navbar-brand>
      <!--
     <b-dropdown split split-href="music" text="Music" class="m-2">
      <b-dropdown-item-button>Music</b-dropdown-item-button>
      <b-dropdown-item-button>Another action</b-dropdown-item-button>
      <b-dropdown-item-button>Something else here</b-dropdown-item-button>
    </b-dropdown>
      -->
    <div v-if="user">
      login as {{dispname}}
      <md-button class="md-raised" v-on:click=doLogout>loout</md-button>
    </div>
    <div v-else>
       <md-button class="md-raised md-primary" v-on:click=doLogin>login</md-button>
    </div>
    <div class="navbar-collapse justify-content-end">
    <a style="text-align:right;" href="https://sites.google.com/view/biones/ds/%E3%83%AC%E3%83%91%E3%83%BC%E3%83%88%E3%83%AA%E3%83%BC%E7%AE%A1%E7%90%86">
    作者サイト</a>
      </span>
      </div>
    </b-navbar>   
  </div>
</template>

<script>
import firebase from 'firebase'
import Vue from 'vue'


export default {
  name: "Header",
  //props:["user"],
  data() {
    return {
      user:null,
      test:"testt",
      dispname:null
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(luser => {
      console.log(luser)
      //this.user = user ? user: {}
      if(!luser)return false
      this.user=luser
      this.dispname = this.user.email      
      Vue.prototype.user=luser      
    })
  },
  methods: {
    // ログイン処理
    doLogin() {
      //const provider = new firebase.auth.TwitterAuthProvider()
      var provider = new firebase.auth.GoogleAuthProvider();
      console.log("dologin")
      //provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
      firebase.auth().signInWithPopup(provider).then(function(result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.

          console.log("then")
          firebase.auth().onAuthStateChanged(user=>{
              console.log(user)
              firebase.firestore().collection("users").doc(user.uid).set({displayName:user.displayName},{ merge: true })
          })          
        }).catch(function(error) {
          // Handle Errors here.
          console.log(error)
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
    },
    // ログアウト処理
    doLogout() {
      firebase.auth().signOut()
    },
  }
}

</script>
