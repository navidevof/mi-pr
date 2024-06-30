import '@/assets/styles/global.css';
import 'vue-toastification/dist/index.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import Toast from 'vue-toastification';
import PrimeVue from 'primevue/config';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia().use(piniaPluginPersistedstate));
app.use(router);
app.use(Toast);
app.use(PrimeVue, { unstyled: true });

app.mount('#app');
