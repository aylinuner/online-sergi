<template>
<div class="row">
    <div class="col s12 m6 l6">
        <div class="card grey darken-1">
            <div class="card-content">
                <p class="card-title">Sergi Oluştur</p>
                <form @submit.prevent="sergiEkle">
                    <label class="red-text text-darken-4">Sergi Ad:</label>
                    <input class="input-field" v-model="sergiAd">
                    <button class="btn red darken-3">Kaydet</button>
                </form>
            </div>
        </div>
    </div>
    <div class="col s12 m6 l6">
        <div class="card grey darken-1">
            <div class="card-content">
                <p class="card-title">Sergi Listesi</p>
                <ul class="collection">
                    <li class="collection-item" v-for="sergi in sergiler" :key="sergi.id"> 
                        <span class="title">{{ sergi.sergiAd }}</span>
                        <span>
                            <a  @click="sergiGuncelle(sergi.id)" class="secondary-content">
                                <i :class="sergi.icon"></i>
                            </a>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {ref,onMounted} from 'vue'
import { firestoreRef,tarih } from '@/firebase/config';
import getUser from '@/composables/getUser'
export default {

    setup(){
        const sergiAd=ref('')
        const {kullanici}=getUser()
        const sergiler =ref([])

        onMounted(async ()=>{

            await firestoreRef.collection('sergiler').orderBy('olusturulmaTarihi','desc').onSnapshot(snap=>{
                sergiler.value=[];

                snap.docs.forEach(doc=>{
                    sergiler.value.push({...doc.data(),id:doc.id})
                })
            })
        })

        const sergiEkle=async ()=>{
            if(sergiAd.value!=''){
                let sergi={
                    sergiAd:sergiAd.value,
                    aktiflik:true,
                    icon:'fas fa-level-down-alt red-text text-darken-2',
                    olusturulmaTarihi:tarih(),
                    olusturanUID:kullanici.value.uid
                }

                await firestoreRef.collection('sergiler').add(sergi).then(()=>{
                    sergiAd.value=''
                })
            }
        }

        const sergiGuncelle=async(id)=>{
            const veri=await firestoreRef.collection('sergiler').doc(id).get();

            let aktiflik=veri.data().aktiflik==true ? false:true

            let icon=veri.data().icon=="fas fa-level-down-alt red-text text-darken-2"? "fas fa-level-up-alt green-text text-darken-2" : "fas fa-level-down-alt red-text text-darken-2"
            await firestoreRef.collection('sergiler').doc(id).update({
                aktiflik:aktiflik,
                icon:icon
            })
        }
        return {sergiAd,sergiEkle,sergiler,sergiGuncelle}
    }
}
</script>

<style>

</style>