// Substitua pelos valores do Firebase Console do projeto GradBook+
// Firebase > Project Settings > Your apps > Web app
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'SUBSTITUA_AQUI',
  authDomain: 'gradbook.medgradplus.com.br',
  projectId: 'gradbook-app',
  storageBucket: 'gradbook-app.appspot.com',
  messagingSenderId: 'SUBSTITUA_AQUI',
  appId: 'SUBSTITUA_AQUI',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
