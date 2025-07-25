import { createRouter, createWebHistory } from 'vue-router'
import {authRef} from '../firebase/config'
import Home from '../views/Home.vue'
import SergiListesi from '../views/home/SergiListesi.vue'
import Admin from '../views/admin/Admin.vue'
import Profil from '../views/admin/Profil.vue'



const authKontrol=(to,from,next)=>{
  let kullanici=authRef.currentUser;

  if(!kullanici){
    next({name:'SergiListesi'})
  }else{
    next()
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/sergi-listesi',
        name: 'SergiListesi',
        component: SergiListesi,
      }
    ]
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    children: [
      {
        path: '/profil',
        name: 'Profil',
        component: Profil,
      }
    ],
    beforeEnter:authKontrol
  }
]

const router = createRouter({
  history: createWebHistory(), // ✅ düzeltildi
  routes
})

export default router
