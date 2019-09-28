<template>
  <div id="AudienceView">

      <div>
    <h3>list of {{username}}'s repertory</h3><span  v-model="number">{{number}}</span>曲<span v-model="totaltime">{{totaltime}}</span>分
         
    <md-table md-height="100%" v-model="datas" model="searched" md-sort="composer"
     md-sort-order="asc" md-card md-fixed-header>
      <md-table-toolbar>
          <!--
              
        <h1 class="md-title">list of repertory <div  v-model="number">{{number}}</div>曲<div  v-model="totaltime">{{totaltime}}</div>分</h1>
         -->
      
      </md-table-toolbar>
        
      <md-table-row md-selectable="multiple" slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Title" md-sort-by="title">{{item.title }}</md-table-cell>
        <md-table-cell md-label="composer" md-sort-by="composer">{{item.composer }}</md-table-cell>
        <md-table-cell md-label="genre" md-sort-by="genre">{{ item.genre }}</md-table-cell>
        <md-table-cell md-label="length(min)" md-sort-by="length">{{ item.length}}</md-table-cell>
      </md-table-row>
    </md-table>

  </div>

</div>
</template>

<script>

import firebase from 'firebase'


export default {
  name: 'AudienceView',

  data: () => ({
        db:firebase.firestore(),
        datas:[],
        username:null
        //id:$route.params.id
  })
  , 
    created:async  function(){
            //let uid="8RmWvECvUUUd72HmuXDfwLAJ07r1"
            //uid=$route.params.id
            let tmp=location.pathname.split("/")
            let listid=tmp.slice(-1)[0]
            let uid=tmp.slice(-2)[0]

            console.log("list created")
            console.log(this.db)
            
            //let tmp=await firebase.firestore().collection("users").doc(uid).get()
            console.log(uid,listid)
            this.db.collection("users").doc(uid).collection("repertory").doc("repertory").collection(listid).orderBy("composer").get().then((snp)=>{
                let count=0
                this.datas=[]
                snp.forEach((ssnp)=>{
                    let tmp=ssnp.data()
                    //console.log(tmp)
                    if(tmp.title!="init_song"){
                        tmp.id=ssnp.id
                        tmp.rownumber=count
                        this.datas.push(tmp)
                        count++
                    }                    
                })            
                //this.number=this.datas.length
            })
     
            console.log(uid)
            let udoc=await firebase.firestore().collection("users").doc(uid).get()
            console.log(udoc)
            this.username=udoc.data().displayName
      
    },
    computed:{
        number:function(){
            //console.log(this.datas.length)
            return this.datas.length
        },
         totaltime:function(){
            let sum=0.0
            for(let s in this.datas){
                //console.log(this.datas[s])
                let tmp=parseFloat(this.datas[s].length)
                if(!isNaN(tmp)){
                    sum+=tmp
                }
            }
            console.log(sum)
            return sum
        }
    }
    ,methods:{
     removeall(){
     },
     
    }

}
</script>

<style>

</style>
