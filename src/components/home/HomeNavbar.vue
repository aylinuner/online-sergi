<template>
  <nav class="deep-purple lighten-3">
    <div>
      <router-link :to="{name:'SergiListesi'}" class="brand-logo">
        AOS Online Sergi
      </router-link>
      <ul class="right">
        <li>
          <a class="waves-effect waves-light btn-flat" @click="handleGiris">
            <i class="fab fa-google"></i> <!-- tavsiye edilen ikon -->
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { firebase, authRef,firestoreRef } from '@/firebase/config'
import { useRouter } from 'vue-router'  

export default {
  setup() {
    const router=useRouter()
    const handleGiris = async () => {
    //google hesabı ekleme
      const provider = new firebase.auth.GoogleAuthProvider()
      console.log(provider)

      await authRef.signInWithPopup(provider).then(async()=>{
        console.log(authRef.currentUser);

        const {uid,displayName,email,photoURL}=authRef.currentUser

        const snapshot =await firestoreRef.collection('kullanicilar').where('uid','==',uid).get()

        console.log(snapshot);
        if(snapshot.empty){
            console.log('kullanıcı kaydı bulunamadı')
            const yeniKullanici={
                uid,
                kullaniciAd:displayName,
                email,
                fotoURL:photoURL,
                yetki:'yok'
            }
            firestoreRef.collection('kullanicilar').add(yeniKullanici).then(()=>{
                router.push({name:'Profil'})
            })
        }else{
            console.log('kullanıcı sayfası bulundu')
            router.push({name:'Profil'})


        }
      })
    }
    return { handleGiris }
  }
}
</script>

<style>
</style>
