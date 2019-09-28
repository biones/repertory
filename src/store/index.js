import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'
import 'firebase/firestore'


Vue.use(Vuex)

const state = {
  name: 'Tanaka'  
}


export default new Vuex.Store({
  state:{
      user:{},
      db:null,
      username:null
  },
  mutations:{
    init_fb(){
        this.db=firebase.firestore()
        firebase.auth().onAuthStateChanged((user) => {
            if("user")return false
            this.user=user
            this.username=user.displayName
        })        
    }
  }
})