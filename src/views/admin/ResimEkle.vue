<template>
  <div class="row">
    <div class="col s12 m12 l12"> 
        <div class="card grey lighten-2">
            <div class="card-content">
                <span class="card-title">Sergiye Resim Ekle</span>
                <form>
                    <select v-model="sergiSelect">
                        <option value="" disabled selected>Sergi Seçiniz </option>
                        <option v-for="sergi in sergiler" :key="sergi.id" :value="sergi.id">
                            <span class="red-text">{{ sergi.sergiAd }}</span>
                        </option>
                        <!-- <option value="1" disabled selected><span class="red-text">Sergi 1</span></option> -->
                        <!-- <option value="2" disabled selected>Sergi Seçiniz </option> -->
                    </select>
                    <input class="input-field" placeholder="Resim Ad" v-model="resimAd">
                    <input class="input field" placeholder="Sanatçı Adı" v-model="sanatciAd">
                    <input class="input field" type="number" placeholder="Resim Sırası" v-model="resimSira">
                    <div class="file-field input-field">
                        <div class="btn red lighten-2">
                            <span>Dosya</span>
                            <input type="file" @change="resimDosyaYukle">
                        </div>
                        <div class="file-path-wrapper">
                            <input class="file-path validate" type="text" placeholder="Resim dosyasını seçiniz"/>
                        </div>
                    </div>
                    <div class="progress red lighten-3" v-if="progressVisible">
                        <div class="determinate red darken-2" :style="progressStyle"></div>
                        
                    </div>
                  <div class="center-align">
                    <button class="btn red darken-3 btn-large">Sergiye resim ekle</button>
                  </div>
                  <p class="red-text">{{ dosyaHata }}</p>
                </form>

            </div>

        </div>

    </div>

  </div>
   <div class="row">
    <div class="col s12 m12 l12"> 
        <div class="card grey lighten-2">
            <div class="card-content">
                <span class="card-title">Resim Listesi</span>
                    <select v-model="sergiSelect">
                        <option value="" disabled selected>Sergi Seçiniz </option>
                        <option v-for="sergi in sergiler" :key="sergi.id" :value="sergi.id">
                            <span class="red-text">{{ sergi.sergiAd }}</span>
                        </option>
                        <!-- <option value="1" disabled selected><span class="red-text">Sergi 1</span></option> -->
                        <!-- <option value="2" disabled selected>Sergi Seçiniz </option> -->
                    </select>
                   <button class="btn orange darken-2" @click="resimleriGetir">Resimleri getir</button>
                   <ul class="collection">
                    <li class="collection-item" v-for="resim in resimler" :key="resim.id">
                        <span class="title">
                            {{ resim.resimAd }}
                        </span>
                        <a href="#modal1" @click="resimSil(resim.id)" class="secondary-content modal-trigger">
                            <i class="far fa-trash-alt red-text"></i>
                        </a>
                    </li>
                   </ul>
            </div>
        </div>
    </div>
  </div>
  <div id="modal1" class="modal" v-if="silmeYetki=='admin'">
    <div class="modal-content">
        <h4>Silmek istediğinize emin misiniz</h4>
        <p>Açıklama</p>
    </div>
    <div class="modal-footer">
        <a @click="sil" href="#" class="modal-close waves-effect waves-red btn-flat">Evet</a>
        <a class="modal-close waves-effect waves-green btn-flat" >Hayır</a>
    </div>
  </div>
  <div id="modal1" class="modal" v-else>
    <div class="modal-content">
        <h4>Yetkiniz bulunmuyor</h4>
    </div>
    <div class="modal-footer">
        <a class="modal-close waves-effect waves-green btn-flat" >Kapat</a>
    </div>
  </div>
</template>

<script>
import {ref, onMounted, onUpdated} from 'vue'
import { firestoreRef,storageRef,authRef } from '@/firebase/config'
import getYetki from '@/composables/getYetki'
export default {
    setup(){
        const sergiSelect=ref('')
        const sergiler=ref([])

        const dosyaTipleri=ref(["image/png","image/jpeg"]);

        const resimDosya=ref(null)
        const dosyaHata=ref('')
        const progressStyle=ref('width:0%')
        const progressVisible=ref(false)

        const resimAd=ref('')
        const sanatciAd=ref('')
        const resimUrl=ref('')
        const resimSira=ref(null)

        const resimler=([])

        const silmeYetki=ref('')

        const resimId=ref('')
     

        onMounted(async()=>{
           
            await firestoreRef.collection('sergiler').where('aktiflik','==',true).onSnapshot(snap=>{
                sergiler.value=[]
                snap.docs.forEach(doc=>{
                    sergiler.value.push({...doc.data(),id:doc.id})
                })
            })
             var el=document.querySelectorAll('select')
            M.FormSelect.init(el,{})

            let kullanici=authRef.currentUser;
            const {yetki}=await getYetki (kullanici.uid)
            silmeYetki.value=yetki.value        })
        onUpdated(()=>{
            M.AutoInit();
        })

        const resimDosyaYukle=(e)=>{
            let secilenDosya=e.target.files[0];

            if(secilenDosya && dosyaTipleri.value.includes(secilenDosya.type)){
                resimDosya.value=secilenDosya;
                dosyaHata.value=null
            }else{
                dosyaHata.value="Seçilen dosya pgn ya da jpeg olmalı"
            }
        }

        const resimEkle=async ()=>{
            if(dosyaHata.value==null){
                progressVisible.value=true;

                const storage=storageRef.ref(`resimler/${M.guid()}`)

                const resimRef=storage.put(resimDosya.value).on('state_changed',(snap)=>{
                    let yuzdelik=(snap.bytesTransferred/snap.totalBytes)*100;

                    progressStyle.value=`width:${yuzdelik}%`
                },err=>{
                    dosyaHata.value="Dosya yüklenirken hata oluştu"
                },async()=>{
                    setTimeout(async()=>{
                        progressVisible.value=false;
                        dosyaHata.value='Dosya Yüklendi'

                        resimUrl.value=await storage.getDownloadURL();
                        const resim={
                            sergiId:sergiSelect.value,
                            resimAd:resimAd.value,
                            sanatciAd:sanatciAd.value,
                            resimSira:resimSira.value,
                            resimUrl:resimUrl.value 
                        }

                        await firestoreRef.collection('resimler').add(resim).then((r)=>{
                            dosyaHata.value=`${r.id} id'li resim eklendi`
                            sergiSelect.value=''
                            resimAd.value=''
                            sanatciAd.value=''
                            resimSira.value=''
                        })
                    },500)
                })
            }
        }

        const resimleriGetir=async ()=>{
            await firestoreRef.collection('resimler').where('sergiId','==',sergiSelect.value).onSnapshot(snap=>{
                resimler.value=[]
                snap.docs.forEach(doc=>{
                    resimler.value.push({...doc.data(),id:doc.id})
                })
            })
        }

        const resimSil=(id)=>{
            resimId.value=id
        }

        const sil=async ()=>{
            await firestoreRef.collection('resimler').doc(resimId.value).delete()
        }

        return{sergiSelect,sergiler,resimDosyaYukle,dosyaHata,resimEkle,progressStyle,progressVisible,resimAd,sanatciAd,resimSira,resimleriGetir,resimler,resimSil,silmeYetki,sil}
    }

}
</script>

<style scoped>
::placeholder{
    color:#636e72;
    opacity: 1;
}

</style>