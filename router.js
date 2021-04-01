import Vue from 'vue'
import Router from 'vue-router'

import MusicList from '@/components/musiclist.vue'
//import AudienceView from '@/components/List.vue'
import Top from '@/components/Top.vue'
import TopNotlogin from '@/components/TopNotlogin.vue'

const About = { template: '<p>about page</p>' }
Vue.use(Router)

let router= new Router({
  mode: 'history',
  routes: [
    { path: '/:uid/:id',
      name:"AudienceView",
      components:{
        default:MusicList,
        notlogin:MusicList        
      }
    },
    {
      path: '/about', // About画面のパス（URL）を設定
      name: 'About', // Aboutコンポーネントの名前を設定
      component: About // Aboutコンポーネントを設定
    },
    {
      path: '/', // About画面のパス（URL）を設定
      components:{
        default:Top,// Aboutコンポーネントを設定
        notlogin:TopNotlogin
      }
    }
  ]
})

export default router
