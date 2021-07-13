/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default Vuex.createStore({
  state() {
    return {
      homePageData: [],
    };
  },

  actions: {
    // fetchHomePageData({ commit }) {
    //   return fetchAllBeers()
    //     .then((data) => {
    //       commit('setHomePageData', data.beers);
    //     });
    // },
  },

  mutations: {
    setHomePageData(state, data) {
      state.homePageData = data;
    },
  },

});
