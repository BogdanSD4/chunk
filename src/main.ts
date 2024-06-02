import './assets/main.css'
import 'primevue/resources/themes/md-dark-indigo/theme.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';

import App from './App.vue'
import router from './router'
import Button from 'primevue/button';

const app = createApp(App)

app.use(createPinia())
app.use(PrimeVue, { ripple: true })
app.use(router)

app.mount('#app')
