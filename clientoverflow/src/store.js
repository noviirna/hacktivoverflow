import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
    questions: []
  },
  mutations: {
    isLogin: (store, data) => {
      store.isLogin = data;
    },
    questions: (store, data) => {
      store.questions = data;
    },
    onequestion: (store, data) => {
      store.onequestion = data;
    }
  },
  actions: {
    isLogin: ({ commit }, data) => {
      commit("isLogin", data);
    },
    questions: ({ commit }, data) => {
      commit("questions", data);
    },
    onequestion: ({ commit }, data) => {
      commit("onequestion", data);
    }
  }
});
