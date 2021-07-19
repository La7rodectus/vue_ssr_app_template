import Vuex from 'vuex';

export default Vuex.createStore({
  state: {
    counter: 0,
  },
  mutations: {
    INCREMENT(state) {
      console.log('INCREMENT');
      state.counter++;
    },
  },
});
