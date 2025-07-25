import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCre5qHgKbw0oFO7gANlXxx92Q2cpF_AaM",
  authDomain: "vue3-firebase-projeler-8b9eb.firebaseapp.com",
  projectId: "vue3-firebase-projeler-8b9eb",
  storageBucket: "vue3-firebase-projeler-8b9eb.appspot.com",
  messagingSenderId: "1090191809786",
  appId: "1:1090191809786:web:4d29520db96fcb7903bd43"
};

// init firebase
firebase.initializeApp(firebaseConfig)

// init services
const firestoreRef = firebase.firestore()
const authRef = firebase.auth()
const storageRef = firebase.storage()

// timestamp
const tarih = firebase.firestore.FieldValue.serverTimestamp

export { firebase, firestoreRef, authRef, storageRef, tarih }
