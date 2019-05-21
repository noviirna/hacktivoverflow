import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false
  },
  mutations: {
    isLogin: (store, data) => {
      store.isLogin = data;
    }
  },
  actions: {
    isLogin: ({ commit }, data) => {
      commit("isLogin", data);
    }
  }
});
