<template>
  <div class="home">
    <router-link to="/about">About</router-link>
    <HelloWorld msg="This is the Home Page"/>
  </div>
</template>

<script>
import HelloWorld from '../components/HelloWorld.vue';

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
};
</script>
