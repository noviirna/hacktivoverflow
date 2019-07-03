import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
    user: {},
    questions: [],
    serverURL: "http://localhost:3000"
  },
  mutations: {
    SET_ISLOGIN: (store, data) => {
      store.isLogin = data.status;
      store.user = data.user;
    },
    SET_QUESTIONS: (store, data) => {
      store.questions = data;
    },
    questiondetail: (store, data) => {
      store.questiondetail = data;
    }
  },
  actions: {
    checkLogin: ({ commit }) => {
      if (localStorage.token) {
        let user = JSON.parse(localStorage.getItem("user"));
        commit("SET_ISLOGIN", { status: true, user });
      } else {
        let user = {};
        commit("SET_ISLOGIN", { status: false, user });
      }
    },
    registering: ({ state }, data) => {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: state.serverURL + "/register",
          data
        })
          .then(({ data }) => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    loggingIn: ({ commit, state }, data) => {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: state.serverURL + "/login",
          data
        })
          .then(({ data }) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            commit("SET_ISLOGIN", { status: true, user: data.user });
            resolve(data.user);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    FETCH_ALL_QUESTIONS({ commit }) {
      axios({
        method: "get",
        url: "http://35.238.179.168/questions"
      })
        .then(({ data }) => {
          commit("SET_QUESTIONS", data);
          console.log(data);
        })
        .catch(({ response }) => {
          console.log(response);
        });
    },
    questiondetail: ({ commit }, data) => {
      commit("questiondetail", data);
    },
    SUBMIT_QUESTION: ({ commit, state }, data) => {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: state.serverURL + "/question",
          headers: {
            token: localStorage.token
          },
          data: data
        })
          .then(({ data }) => {
            let questions = state.questions;
            questions.push(data);
            commit("SET_QUESTIONS", questions);
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
});
