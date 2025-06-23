import './assets/main.css'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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