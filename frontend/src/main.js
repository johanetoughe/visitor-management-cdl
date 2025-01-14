import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

// Utilise le routeur
app.use(router);

// Monte l'application sur l'élément DOM avec l'id #app
app.mount('#app');
