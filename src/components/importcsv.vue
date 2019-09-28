<template>
  <div id="ImportCsv">
     <input @change="fileRead" type="file" id="file_input_expense" name="file_input_expense">
     <br>
     <md-button class="md-raised md-primary" v-on:click=import_csv>importする</md-button>
</div>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'ImportCsv',
  components: {

  },
    data: () => ({
      db:firebase.firestore(),
      csvdatas:[]
    })
  ,
  computed:{
    
  },
  methods:{
     async addmusic(){
       await firebase.auth().onAuthStateChanged((user) => {
         this.user=user
       })
       var batch = this.db.batch()
       for(var i=0;i<this.title.length;i++){
          var data={
            title:this.title[i],
            composer:this.composer[i],
            genre:this.genre[i],
            length:this.length[i]
          }
          for(let k in data){
            if(data[k]==undefined){
              data[k]=null
            }
          }
          //console.log(Header.data())
          console.log("addmusic")
          console.log(data)
          //clist=this.$parent.$parent.choosedlist
          let clist="default"                                     
          let ref=this.db.collection("users").doc(this.user.uid).collection("repertory").doc(clist).collection(clist).doc()
          batch.set(ref,data)
       }
       batch.commit()
    },
    fileRead(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      

      const loadFunc = () => {
        var lines = reader.result.split("\n");
        lines.shift()

        lines.forEach(element => {
          var tmp = element.split(",").slice(0,4);        
          this.csvdatas.push(tmp.slice(0,4));
          
        })
      };

      // onloadはreadAsBinaryStringでファイルを読み込んだ後に実行されます.
      reader.onload = loadFunc;
      //reader.readAsBinaryString(file)
      reader.readAsText(file)
      console.log(reader.result)
    },

    import_csv(){
      console.log(this.title)
      for(let i=0;i<this.csvdatas.length;i++){
        let row=this.csvdatas[i]
        if(row[0].length<=0)continue
        this.title.push(row[0])
        this.composer.push(row[1])
        this.genre.push(row[2])
        this.length.push(parseFloat(row[3]))
      }

      this.addmusic()
    }
  }
}
</script>

<style>

</style>
