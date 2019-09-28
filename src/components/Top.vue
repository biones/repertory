
<template>
  <div id="Top">
    <md-button v-if="addm==false" class="md-raised md-primary" v-on:click="addm=true">新しい曲を追加する</md-button>
    <div v-if="addm==true" class="w-50 p-2">
      <md-field>
        <label>Title</label>
        <md-input v-model="title"></md-input>
      </md-field>
      <md-field>
        <label>composer</label>
        <md-input v-model="composer"></md-input>
      </md-field>
      <md-field>
        <label>genre</label>
        <md-select v-model="genre">
            <md-option v-for="item in genrenames" :value="item">{{item}}</md-option>
        </md-select>
      </md-field>
      <md-field>
        <label>length(minute)</label>
        <md-input v-model="length"></md-input>
      </md-field>

      <md-field>
        <label>music file url</label>
        <md-input v-model="mfileurl"></md-input>
      </md-field>
      <md-field>
        <label>sheet url</label>
        <md-input v-model="scoreurl"></md-input>
      </md-field>

      <md-field>
        <label>comment</label>
        <md-input v-model="comment"></md-input>
      </md-field>

      <md-field>
        <label>追加するリスト</label>
        <md-select v-model="choosedlist">
          <md-option v-for="item in list" :value="item">{{item}}</md-option>
        </md-select>
      </md-field>
      <md-button class="md-raised md-primary" v-on:click="addmusic">曲を追加</md-button>
    </div>
    <div class="float-right">
      <md-button
        v-if="!disprequest"
        class="md-raised md-primary"
        v-on:click="disprequest=true"
      >リクエストを表示</md-button>
      <md-button
        v-if="disprequest"
        class="md-raised md-primary"
        v-on:click="disprequest=false"
      >リクエストを閉じる</md-button>

      <div v-if="disprequest" v-for="ms in messages">{{ms.title}} {{ms.composer}} <small style="font-size:0.8em">{{ms.createAt}}</small></div>
    </div>
    <br />
    <br />

    <div class="pull-left">
      <div class="md-layout-item md-size-20">
        <md-field>
          <md-select v-model="choosedlist">
            <md-option v-for="item in list" :value="item">{{item}}</md-option>
          </md-select>
        </md-field>
      </div>
      <md-field>
        public URL
        <a v-model="url" v-bind:href="url" target="_blank">{{url}}</a>
      </md-field>
    </div>

    <br />
    <br />
    <br />
    <br />
    <MusicList ref="musiclist" v-bind:listprp="choosedlist" v-model="datas"></MusicList>
    <br />
    <br />
    <br />
    <br />

    <!--
<form class="form">
<vue-csv-import v-model="Csv" ef="importer" :map-fields="['title','composer','genre','length']"></vue-csv-import>
</form>
{{Csv}}
    -->
  </div>
</template>

<script>
import firebase from "firebase";
import ImportCsv from "@/components/importcsv.vue";
import MusicList from "@/components/musiclist.vue";

import store from "@/store";

//import AudienceView from '@/components/List.vue'

export default {
  name: "Top",
  components: {
    ImportCsv,
    MusicList
  },
  data: () => ({
    db: firebase.firestore(),
    addm: false,
    csvdatas: [],
    title: null,
    composer: null,
    length: null,
    genre: null,
    kanseido: null,
    level: null,
    fileurl: null,
    soundurl: null,
    list: ["default"],
    choosedlist: "default",
    genrenames:["classic","baroque","roman","modern","jazz","pops","screen","before_baroque","original","none"],
    user: null,
    //url:null,
    uid: null,
    datas: null,
    messages: [],
    disprequest: false
  }),
  /*
  watch:{
      choosedlist:function(){
       let baseurl="http://localhost/user/"
       baseurl="https://repertory-b7e36.web.app/user/"
        this.url=baseurl+this.user.uid+"/"+this.choosedlist
      }
  },*/
  computed: {
    url: function() {
      let baseurl = "http://localhost/user/";
      baseurl = "https://repertory-b7e36.web.app/";
      if (this.user) {
        return baseurl + this.user.uid + "/" + this.choosedlist;
      } else {
        return "";
      }
    }
  },
  created: async function() {
    firebase.auth().onAuthStateChanged(async user => {
      if (!user) return false;
      this.user = user;
      this.db
        .collection("users")
        .doc(user.uid)
        .collection("musiclist")
        .get()
        .then(snp => {
          console.log(snp)
          snp.forEach(element => {
            console.log(element.data())
            this.list.push(element.data().listname);
          });
        });

      let vinstance = this;
      await this.db
        .collection("users")
        .doc(user.uid)
        .collection("messages")
        .orderBy("createAt")
        .onSnapshot(function(docs) {
          console.log(docs);
          vinstance.messages = [];
          docs.forEach(doc => {
            let dat = doc.data();
            let tmp=dat.createAt.toDate()

            dat.createAt=tmp
            vinstance.messages.unshift(dat);
          });
        });
    });
    //console.log(gtest)
  },
  methods: {
    addmusic() {
      var data = {
        title: this.title,
        composer: this.composer,
        genre: this.genre,
        length: this.length
      };

      firebase.auth().onAuthStateChanged(user => {
        this.db
          .collection("users")
          .doc(user.uid)
          .collection("repertory")
          .doc(this.choosedlist)
          .collection(this.choosedlist)
          .doc()
          .set(data);
        this.$refs.musiclist.pushdatas(data);
        this.db
          .collection("users")
          .doc(user.uid)
          .collection("repertory")
          .doc("default")
          .collection("default")
          .doc()
          .set(data);
        //let ml=document.getElementById("MusicList")
        //console.log("pushed",ml)
      });
    }
  }
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
