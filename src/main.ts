import './assets/main.css'
import PrimeVue from 'primevue/config';
import Material from '@primeuix/themes/material';
import { createApp, watch  } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'primevue/resources/themes/aura-light-green/theme.css'

const app = createApp(App)

const pinia = createPinia();
app.use(pinia)
app.use(router)
app.use(PrimeVue, {
    // Default theme configuration
    theme: {
        preset: Material,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
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