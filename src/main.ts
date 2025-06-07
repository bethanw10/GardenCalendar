import './assets/main.css'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2hVY4Zqh45oz2J6tnWy7IoN8jgcwxU54",
  authDomain: "garden-calendar-bethanw.firebaseapp.com",
  projectId: "garden-calendar-bethanw",
  storageBucket: "garden-calendar-bethanw.firebasestorage.app",
  messagingSenderId: "830725281174",
  appId: "1:830725281174:web:5415680b6aa215792db9b7",
  measurementId: "G-94FJ58JBCV"
};

// Initialize Firebase
const fireapp = initializeApp(firebaseConfig);
const analytics = getAnalytics(fireapp);

//import 'primevue/resources/themes/aura-light-green/theme.css'

const app = createApp(App)
const pinia = createPinia();

app.use(pinia)
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
    }
 });

app.mount('#app')

// watch(
//   pinia.state,
//   (state) => {
//     localStorage.setItem("calendar", JSON.stringify(state.counter));
//   },
//   { deep: true }
// );