import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './i18n'

// Get stored locale or default to English
const storedLocale = localStorage.getItem('preferred-locale') || 'en';

const i18n = setupI18n({ locale: storedLocale });
const app = createApp(App);

app.use(i18n);
app.mount('#app');