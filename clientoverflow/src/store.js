import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import swal from "sweetalert2";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
    user: {},
    questions: [],
    answers: [],
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
    SET_ANSWERS: (state, data) => {
      state.answers = data;
    },
    UNSHIFT_QUESTION: (state, data) => {
      state.questions.unshift(data);
    },
    UNSHIFT_ANSWER: (state, data) => {
      state.answers.unshift(data);
    },
    SPLICE_QUESTION: (state, data) => {
      state.questions.splice(data, 1);
    },
    SPLICE_ANSWER: (state, data) => {
      state.answers.splice(data, 1);
    },
    CHANGE_A_QUESTION: (state, data) => {
      state.questions = data;
    },
    CHANGE_A_ANSWER: (state, data) => {
      state.answers = data;
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
        url: state.serverURL + "/questions",
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
    FETCH_ALL_ANSWERS({ commit, state }, questionId) {
      axios({
        method: "get",
        url: state.serverURL + "/answers/" + questionId,
        headers: {
          token: localStorage.token
        }
      })
        .then(({ data }) => {
          console.log(data);
          commit("SET_ANSWERS", data);
        })
        .catch(({ response }) => {
          console.log(response);
        });
    },
    questiondetail: ({ commit }, data) => {
      commit("questiondetail", data);
    },
    SUBMIT_ANSWER: ({ commit, state }, data) => {
      return new Promise((resolve, reject) => {
        axios({
          method: "post",
          url: state.serverURL + "/answers",
          headers: {
            token: localStorage.token
          },
          data: data
        })
          .then(({ data }) => {
            commit("UNSHIFT_ANSWER", data);
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      });
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
    DELETE_ANSWER: ({ commit, state }, targetId) => {
      return new Promise((resolve, reject) => {
        axios({
          method: "DELETE",
          url: state.serverURL + "/answers/" + targetId,
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
            commit("SPLICE_ANSWER", i);
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
    },
    UPDATE_QUESTION_LIKE: ({ commit, state }, question) => {
      axios({
        method: "PUT",
        url: state.serverURL + "/questions/ud/" + question._id,
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
              updated[i].upvotes = data.upvotes;
              updated[i].downvotes = data.downvotes;
            }
          });
          commit("CHANGE_A_QUESTION", updated);
        })
        .catch(err => {
          console.log(err);
          swal.fire("sorry", err.response.data.message, "error");
        });
    },
    UPDATE_ANSWER: ({ commit, state }, answer) => {
      return new Promise(function(resolve, reject) {
        axios({
          method: "PUT",
          url: state.serverURL + "/answers/" + answer._id,
          headers: {
            token: localStorage.getItem("token")
          },
          data: answer.data
        })
          .then(({ data }) => {
            let updated = [];
            state.answers.forEach(a => {
              updated.push(a);
            });
            updated.forEach((a, i) => {
              if (a._id == data._id) {
                updated[i] = data;
                updated[i].userId = state.user;
              }
            });
            commit("CHANGE_A_ANSWER", updated);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    UPDATE_ANSWER_LIKE: ({ commit, state }, answer) => {
      axios({
        method: "PUT",
        url: state.serverURL + "/answers/ud/" + answer._id,
        headers: {
          token: localStorage.getItem("token")
        },
        data: answer.data
      })
        .then(({ data }) => {
          let updated = [];
          state.answers.forEach(q => {
            updated.push(q);
          });

          updated.forEach((q, i) => {
            if (q._id == data._id) {
              updated[i].upvotes = data.upvotes;
              updated[i].downvotes = data.downvotes;
            }
          });
          commit("CHANGE_A_ANSWER", updated);
        })
        .catch(err => {
          console.log(err);
          swal.fire("sorry", err.response.data.message, "error");
        });
    }
  }
});
