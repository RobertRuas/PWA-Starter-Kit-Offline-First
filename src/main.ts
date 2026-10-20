import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { IonicVue } from '@ionic/vue'
import App from './app/App.vue'
import router from './app/router'

/* Ionic CSS */
import '@ionic/vue/css/ionic.bundle.css'

/* Design system */
import './styles/global.css'

const app = createApp(App)

app.use(IonicVue, {
  mode: 'md',
})
app.use(createPinia())
app.use(router)

router.isReady().then(() => {
  app.mount('#app')
})
