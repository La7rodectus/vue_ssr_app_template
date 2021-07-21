import { createSSRApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

/**
 * export a factory function for creating a root component
 * @returns {{ VueSSRApp, VueRouter, Vuex }}
 */
export default function() {
  const app = createSSRApp(App);

  app.use(store);
  app.use(router);

  return { app, router, store };
}
