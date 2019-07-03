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
    SET_ISLOGIN: (state, data) => {
      state.isLogin = data.status;
      state.user = data.user;
    },
    SET_QUESTIONS: (state, data) => {
      state.questions = data;
    },
    UNSHIFT_QUESTION: (state, data) => {
      state.questions.unshift(data);
    },
    SPLICE_QUESTION: (state, data) => {
      state.questions.splice(data, 1);
    },
    CHANGE_A_QUESTION: (state, data) => {
      state.questions = data;
    },
    questiondetail: (state, data) => {
      state.questiondetail = data;
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
    // DONE
    registering: ({ state }, data) => {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: state.serverURL + "/users/register",
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
    // DONE
    loggingIn: ({ commit, state }, data) => {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: state.serverURL + "/users/login",
          data
        })
          .then(({ data }) => {
            console.log(JSON.stringify(data));
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
    // DONE
    FETCH_ALL_QUESTIONS({ commit, state }) {
      axios({
        method: "get",
        url: state.serverURL + "/questions?sort=desc",
        headers: {
          token: localStorage.token
        }
      })
        .then(({ data }) => {
          commit("SET_QUESTIONS", data);
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
          url: state.serverURL + "/questions",
          headers: {
            token: localStorage.token
          },
          data: data
        })
          .then(({ data }) => {
            commit("UNSHIFT_QUESTION", data);
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    DELETE_QUESTION: ({ commit, state }, targetId) => {
      return new Promise((resolve, reject) => {
        axios({
          method: "DELETE",
          url: state.serverURL + "/questions/" + targetId,
          headers: {
            token: localStorage.token
          }
        })
          .then(() => {
            let i = undefined;
            state.questions.forEach((question, index) => {
              if (question._id == targetId) {
                i = index;
              }
            });
            commit("SPLICE_QUESTION", i);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    UPDATE_QUESTION: ({ commit, state }, question) => {
      return new Promise(function(resolve, reject) {
        axios({
          method: "PUT",
          url: state.serverURL + "/questions/" + question._id,
          headers: {
            token: localStorage.getItem("token")
          },
          data: question.data
        })
          .then(({ data }) => {
            let updated = [];
            state.questions.forEach(q => {
              updated.push(q);
            });

            updated.forEach((q, i) => {
              if (q._id == data._id) {
                updated[i] = data;
                updated[i].userId = state.user;
              }
            });
            commit("CHANGE_A_QUESTION", updated);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});
