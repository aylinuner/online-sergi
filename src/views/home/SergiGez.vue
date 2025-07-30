<template>
  <div class="card black">
    <div class="card-content">
        <div class="slider">
            <ul class="slides">
                <li v-for="resim in sergiResimler" :key="resim.id">
                    <img :src="resim.resimUrl">
                    <div class="caption left-align">
                        <p> Resim Ad:{{ resim.resimAd }}</p>
                        <p class="light red-text text-lighten-3">
                            {{ resim.sanatciAd }}
                        </p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
  </div>
</template>

<script>
import { onMounted,ref,onUpdated } from 'vue';
import { firestoreRef } from '@/firebase/config';
import {useRoute} from 'vue-router'
export default {

    setup(){
        const route=useRoute()
        const sergiResimler=ref([])

        onMounted(async()=>{
            const resimler=await firestoreRef.collection('resimler').where('sergiId','==',route.params.sergiId).orderBy('resimSira').get()

            resimler.docs.forEach(doc=>{
                sergiResimler.value.push({...doc.data(),id:doc.id})
            })
        })

        onUpdated(()=>{
            var elems= document.querySelectorAll('.slider')
            var intances = M.Slider.init(elems,{interval:1200,duration:30000,height:400})
        })
        return{sergiResimler}
    }
}
</script>

<style>

</style>