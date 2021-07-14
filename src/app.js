import { createSSRApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
//const isSSR = typeof window === 'undefined';
// export a factory function for creating a root component
export default function() {
  const app = createSSRApp(App);
  //const app = (isSSR ? createSSRApp(App) : createApp(App));
  app.use(store);
  app.use(router);

  return { app, router, store };
}
