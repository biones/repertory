// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import App from './App'
import router from './router'

import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import firebase from 'firebase'
import 'firebase/firestore'

import store from './store'



/*
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
*/


Vue.use(VueMaterial)

Vue.config.productionTip = false




firebase.initializeApp(config);

console.log(router)


Vue.mixin({
  data:function(){
    return {
    guser:null,
  }
  },
  created: function () {
    //var myOption = this.$options.myOption

    firebase.auth().onAuthStateChanged(user => {
      this.guser=user
    })
  },
  methods: {
    getguser:function(){
      return this.guser
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  render: h => h(App),
  template: '<App/>'
})

//store.commit("init_fb")
