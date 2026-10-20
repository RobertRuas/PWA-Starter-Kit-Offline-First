import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { IonicVue } from '@ionic/vue';
import App from './app/App.vue';
import router from './app/router';

/* CSS do Ionic */
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Estilos da aplicação */
import './styles/global.css';

const pinia = createPinia();
const app = createApp(App);

app.use(IonicVue);
app.use(pinia);
app.use(router);

router.isReady().then(() => {
  app.mount('#app');
});
