import { createSSRApp } from 'vue';
import App from './App.vue';

// export a factory function for creating a root component
export default function () {
  const app = createSSRApp(App);

  return {
    app,
  };
}
