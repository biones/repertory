<template>
  <div id="MusicList">
    <md-button class="md-primary md-raised" @click="active = true" style="position: absolute; left:100px">リストにない曲をリクエストする</md-button>
    <br><br><br>
    <div class="col-12 clearfix" v-if="owner_mode">
      <div class="float-right">
        <md-field>
          <md-input v-model="alistname"></md-input>
          <md-button @click="appendlist" class="md-raised md-primary"
            >add new list</md-button
          >
        </md-field>
      </div>

      <md-button class="md-raised" @click="removelist()">remove list</md-button>
      <md-button class="md-raised">renamelist</md-button>
      <md-button class="md-raised" @click="showDialogadlist = true"
        >選択項目をリストへ追加</md-button
      >
      <md-button class="md-raised" @click="addtonewlist"
        >選択項目から新しいリストを作成</md-button
      >
      <md-button
        v-if="owner_mode"
        class="md-raised md-primary"
        v-on:click="remove"
        >remove selected</md-button
      >
      <br />
    </div>
   

    
    <div v-if="active"  style="width:200px"　class="pull-right">
      <br><br>
       <form novalidate class="md-layout col-md-offset-5" @submit.prevent="validateUser">
          <md-field>
      <label>曲名</label>
      <md-input v-model="music_title"></md-input>
      </md-field>

      <md-field>
        <label>作曲家名</label>
       <md-input v-model="composer"></md-input>
      </md-field>

        <md-field>
          <label>楽譜のurl</label>
       <md-input v-model="url"></md-input>
      </md-field>


      <md-field>        
      <label>HN</label>
      <md-input v-model="name"></md-input>
      </md-field>

      <md-button @click.once="post" class="md-dense md-raised md-primary">送信する</md-button>
    </form>
   </div>

    <div>
      <h3>{{ username }}の{{ list }}リスト</h3>
      <span v-model="number">{{ number }}</span
      >曲
      <span v-model="totaltime">{{ totaltime }}</span>
      分
      <md-dialog v-if="showDialog" :md-active.sync="showDialog">

          <md-dialog-actions>
            <div class="md-layout md-gutter">
            <md-field>
              <label>Title</label>
              <md-input v-model="datas[editid].title"></md-input>
            </md-field>
            <md-field>
              <label>composer</label>
              <md-input v-model="datas[editid].composer"></md-input>
            </md-field>
            <md-field>
              <label>genre</label>
              <md-input v-model="datas[editid].genre"></md-input>
            </md-field>
            <md-field>
              <label>length(minute)</label>
              <md-input v-model="datas[editid].length"></md-input>
            </md-field>
            <br>
            <md-field>
              <label>comment</label>
              <md-input v-model="datas[editid].length"></md-input>
            </md-field>
           
                <md-field>
              <label>score url</label>
              <md-input v-model="datas[editid].url"></md-input>
            </md-field>
            <md-field>
              <label>youtube url</label>
              <md-input v-model="datas[editid].url_youtube"></md-input>
            </md-field>            
          </div>

          </md-dialog-actions>
          
          <md-button class="md-primary" @click="showDialog = false"
            >Close</md-button
          >
          <md-button
            class="md-primary"
            @click="
              save(editid);
              showDialog = false;
            "
            >Save</md-button
          >

      </md-dialog>

      <md-table
        md-height="100%"
        v-model="datas"
        md-sort="composer"
        md-sort-order="asc"
        @md-selected="onSelect"
      >
        <md-table-row
          md-selectable="multiple"
          slot="md-table-row"
          slot-scope="{ item, index }"
        >
          <md-table-cell md-label="Title" md-sort-by="title">{{
            item.title
          }}</md-table-cell>
          <md-table-cell md-label="Composer" md-sort-by="composer">{{
            item.composer
          }}</md-table-cell>
          <md-table-cell md-label="Genre" md-sort-by="genre">{{
            item.genre
          }}</md-table-cell>
          <md-table-cell md-label="Length(min)" md-sort-by="length">{{
            item.length
          }}</md-table-cell>
          <md-table-cell v-if="owner_mode" md-label>
            <button @click="edit(index + 1)">edit</button>
          </md-table-cell>
          <md-table-cell v-if="!owner_mode" md-label>
              <div v-if="!item.hidden">
             <md-button class="md-primary" @click.once="request(item)" v-on:click="item.hidden=true" >リクエストする</md-button>
             </div>
             <div v-else>
               thank you
              </div>

          </md-table-cell>
        </md-table-row>
      </md-table>

      <div v-if="owner_mode">
        CSVファイルをインポート(title,composer,genre の順)
        <br />
        <ImportCsv></ImportCsv>
      </div>
    </div>
    <md-dialog :md-active.sync="showDialogadlist">
      <br />
      <label>リスト名</label>
      <select v-model="addlistname">
        <option v-for="ln in this.$parent.list" v-bind:value="ln">{{
          ln
        }}</option>
      </select>
      <md-button class="md-primary" @click="showDialogadlist = false"
        >Close</md-button
      >
      <md-button
        class="md-primary"
        @click="
          addtolist();
          showDialogadlist = false;
        "
        >Save</md-button
      >
    </md-dialog>
  </div>
</template>

<script>
import firebase from "firebase";
import ImportCsv from "@/components/importcsv.vue";

export default {
  name: "MusicList",
  props: ["listprp"],

  components: {
    ImportCsv,
  },
  data: () => ({
    db: firebase.firestore(),
    datas: [],
    active:false,
    music_title:null,
    composer:null,
    name:null,
    url:null,
    sortcol: "genre",
    list: "default",
    showDialog: false,
    editid: null,
    username: null,
    selected: [],
    alistname: null,
    user: null,
    owner_mode: false,
    showDialogadlist: false,
    addlistname: "",
    listtest: ["aa", "bb"],
    //number:0,
    //totaltime:0
  }),
  created: async function() {
    this.datas = [];
    let tmp = window.location.href.split("/");

    console.log(tmp);

    if (tmp[3].length <= 10) {
      console.log("owner");
      this.owner_mode = true;
      firebase.auth().onAuthStateChanged((user) => {
        this.username = user.displayName;
        this.user = user;
        this.uid = user.uid;
        this.setsongs();
      });
    } else {
      console.log("notowner");
      this.owner_mode = false;
      this.uid = tmp.slice(-2, -1)[0];
      console.log(tmp.slice(-2, -1));

      tmp = await this.db
        .collection("users")
        .doc(this.uid)
        .get();
      this.username = tmp.data().displayName;
      this.setsongs();
    }
  },
  watch: {
    listprp: function() {
      console.log("changedd listprp");
      console.log(this.listprp);
      this.list = this.listprp;
      this.setsongs();
    },
  },
  computed: {
    litst: function() {
      console.log("list");
      this.setsongs();
      return this.listprp;
    },
    number: function() {
      //console.log(this.datas.length)
      return this.datas.length;
    },
    totaltime: function() {
      let sum = 0.0;
      for (let s in this.datas) {
        //console.log(this.datas[s])
        let tmp = parseFloat(this.datas[s].length);
        if (!isNaN(tmp)) {
          sum += tmp;
        }
      }
      console.log(sum);
      return sum;
    },
  },
  methods: {
    addtonewlist() {
      let listname = prompt("リスト名");

      this.db
        .collection("users")
        .doc(this.user.uid)
        .collection("musiclist")
        .doc(listname)
        .set({ listname: listname });

      /*
      let ref = this.db
        .collection("users")
        .doc(this.user.uid)
        .collection("repertory")
        .doc(this.alistname)
        .collection(this.alistname);
      ref.doc("init_song")
        .set({ title: "init_song" })
        .then(snp => {
        })
      */
      this.$parent.list.push(listname);
      this.addlistname = listname;
      this.addtolist();
    },
    request_prompt(){
      val=window.prompt("title")

    },
    request(item) {
      //let tmp = this.datas[rownum];
      let tmp=item;
      console.log(tmp);
      if(! tmp.url){
        tmp.url=null
      }
      this.db
        .collection("users")
        .doc(this.uid)
        .collection("messages")
        .doc()
        .set({
          title: tmp.title,
          name:null,
          composer: tmp.composer,
          url:tmp.url,
          createAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      
    },
    post(){
      if(this.music_title.length<1)return
      this.db
        .collection("users")
        .doc(this.uid)
        .collection("messages")
        .doc()
        .set({
          title:this.music_title,
          name:this.name,
          composer: this.composer,
          url:this.url,
          createAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

    },
    addtolist() {
      firebase.auth().onAuthStateChanged((user) => {
        //console.log(this.selected)
        this.selected.forEach((s) => {
          this.db
            .collection("users")
            .doc(user.uid)
            .collection("repertory")
            .doc(this.addlistname)
            .collection(this.addlistname)
            .doc(s.id)
            .set(s);
        });
      });
    },
    setsongs() {
      
      this.db
        .collection("users")
        .doc(this.uid)
        .collection("repertory")
        .doc(this.list)
        .collection(this.list)
        .orderBy("composer")
        .get()
        .then((snp) => {
          let count = 1;
          this.datas = [];
          snp.forEach((ssnp) => {
            let tmp = ssnp.data();
            //console.log(tmp)
            if (tmp.title != "init_song") {
              tmp.id = ssnp.id;
              tmp.rownumber = count;
              tmp.hidden=false
              this.datas.push(tmp);
              count++;
            }
            console.log(tmp)
          });
        });
    },
    async appendlist() {
      this.db
        .collection("users")
        .doc(this.user.uid)
        .collection("musiclist")
        .doc(this.alistname)
        .set({ listname: this.alistname });
      let ref = this.db
        .collection("users")
        .doc(this.user.uid)
        .collection("repertory")
        .doc(this.alistname)
        .collection(this.alistname);
      ref
        .doc("init_song")
        .set({ title: "init_song" })
        .then((snp) => {});
      this.$parent.list.push(this.alistname);
      this.alistname = "";
    },
    onSelect(items) {
      console.log(items);
      console.log(this.datas);
      this.selected = items;
    },
    removelist() {
      console.log(this.user.uid, this.$parent.choosedlist);
      let lname = this.$parent.choosedlist;
      if (lname == "default") return;
      this.db
        .collection("users")
        .doc(this.user.uid)
        .collection("musiclist")
        .doc(this.$parent.choosedlist)
        .delete();
      console.log(lname);
      this.db
        .collection("users")
        .doc(this.user.uid)
        .collection("repertory")
        .doc(lname)
        .delete();
      //firebase.firestore.FieldValue.delete()
      this.$parent.list = this.$parent.list.filter((item) => {
        return lname != item;
      });
      this.$parent.choosedlist = "default";
    },
    save(id) {
      /*
         var data2={
            title:this.title,
            composer:this.composer,
            genre:this.genre,
            length:this.length
          }
          */
      let data = this.datas[id];
      console.log(data);
      firebase.auth().onAuthStateChanged((user) => {
        this.db
          .collection("users")
          .doc(user.uid)
          .collection("repertory")
          .doc("repertory")
          .collection("default")
          .doc(data.id)
          .set(data);
        this.editid = false;
      });
    },
    remove() {
      console.log(this.selected);
      let rownums = this.selected.map((e) => {
        return e.rownumber;
      });
      console.log(rownums);

      for (let i = 0; i < this.datas.length; i++) {
        if (rownums.includes(this.datas[i].rownumber)) {
          this.datas.splice(i, 1);
        }
      }

      firebase.auth().onAuthStateChanged((user) => {
        for (let s in this.selected) {
          let tmp = this.selected[s];
          this.db
            .collection("users")
            .doc(user.uid)
            .collection("repertory")
            .doc(this.$parent.choosedlist)
            .collection(this.$parent.choosedlist)
            .doc(tmp.id)
            .delete();
          console.log(tmp.id);
        }
      });
    },
    pushdatas(data) {
      this.datas.push(data);
    },
    edit(eid) {
      console.log(eid);
      this.datas.forEach((d) => console.log(d.title));

      this.showDialog = true;
      this.editid = eid - 1;
    },
  },
};
</script>

<style>
.md-dialog {
  max-width: 768px;
}
</style>
