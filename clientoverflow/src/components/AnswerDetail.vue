<template>
  <div class="answerdetail">
    <!-- New Answer modal -->
    <b-modal hide-footer title="Write your answer here . . ." ref="newanswer-modal">
      <div class="form-group">
        <label for="email">Title ...</label>
        <input
          v-model="answertitle"
          type="title"
          class="form-control"
          id="title"
          aria-describedby="emailHelp"
          placeholder="Answer Title . . ."
        >
      </div>
      <div class="form-group">
        <label for="description">Answer ...</label>
        <textarea
          v-model="answerdescription"
          type="description"
          class="form-control"
          id="description"
          placeholder="Your Answer . . ."
        ></textarea>
      </div>
      <b-button @click="submitanswer" class="mt-2" variant="outline-success" block>Submit Answer</b-button>
    </b-modal>
    <br>
    <!-- Edit Answer modal -->
    <b-modal hide-footer title="Write your answer here . . ." ref="editanswer-modal">
      <div class="form-group">
        <label for="email">Title ...</label>
        <input
          v-model="answertitle"
          type="title"
          class="form-control"
          id="title"
          aria-describedby="emailHelp"
          placeholder="Answer Title . . ."
        >
      </div>
      <div class="form-group">
        <label for="description">Answer ...</label>
        <textarea
          v-model="answerdescription"
          type="description"
          class="form-control"
          id="description"
          placeholder="Your Answer . . ."
        ></textarea>
      </div>
      <b-button @click="submitupdate(updtarget)" class="mt-2" variant="outline-success" block>Update Answer</b-button>
    </b-modal>
    <!-- container question-->
    <div class="container">
      <div class="container my-3">
        <h3>The question . . .</h3>
      </div>
      <ul class="list-group">
        <li class="list-group-item">
          <div class="d-flex justify-content-end">{{ new Date(question.createdAt).toDateString() }}</div>
          <h4>
            <a class="nav-link">
              {{
              question.title
              }}
            </a>
          </h4>
          <p>
            {{
            question.description
            .split()
            .slice(0, 100)
            .join(",")
            }}
            . . .
          </p>
          <div class="d-flex justify-content-between">
            <div>
              <div class="sm">
                <small>
                  {{ countTime(new Date(), new Date(question.createdAt)) }}
                  ago
                </small>
              </div>
              <div>user {{ question.userId }}</div>
            </div>

            <div class="d-flex justify-content-end align-items-center">
              <button
                v-if="$store.state.isLogin && user !== question.userId"
                type="button"
                class="btn btn-link btn-sm"
                @click.prevent="showanswerform"
              >Answer This</button>
              <button
                v-if="
                  question.upvotes.indexOf(user) > -1 && $store.state.isLogin
                "
                type="button"
                class="btn btn-success btn-sm"
                @click="ud(question, 'upvotes')"
              >
                <i class="fas fa-arrow-up"></i>
                {{ question.upvotes.length }}
              </button>
              <button
                v-if="
                  question.upvotes.indexOf(user) < 0 &&
                    $store.state.isLogin &&
                    user !== question.userId
                "
                type="button"
                class="btn btn-outline-success btn-sm"
                @click="ud(question, 'upvotes')"
              >
                <i class="fas fa-arrow-up"></i>
                {{ question.upvotes.length }}
              </button>
              <button
                v-if="
                  question.downvotes.indexOf(user) > -1 &&
                    $store.state.isLogin &&
                    user !== question.userId
                "
                type="button"
                class="btn btn-danger btn-sm ml-3"
                @click="ud(question, 'downvotes')"
              >
                <i class="fas fa-arrow-down"></i>
                {{ question.downvotes.length }}
              </button>
              <button
                v-if="
                  question.downvotes.indexOf(user) < 0 &&
                    $store.state.isLogin &&
                    user !== question.userId
                "
                type="button"
                class="btn btn-outline-danger btn-sm ml-3"
                @click="ud(question, 'downvotes')"
              >
                <i class="fas fa-arrow-down"></i>
                {{ question.downvotes.length }}
              </button>
              <button
                v-if="
                  (question.upvotes.indexOf(user) > -1 &&
                    $store.state.isLogin === false) ||
                    user === question.userId
                "
                type="button"
                class="btn btn-secondary btn-sm"
                disabled
              >
                <i class="fas fa-arrow-up"></i>
                {{ question.upvotes.length }}
              </button>
              <button
                v-if="
                  question.downvotes.indexOf(user) < 0 &&
                    $store.state.isLogin === false
                "
                type="button"
                class="btn btn-outline-secondary btn-sm"
                disabled
              >
                <i class="fas fa-arrow-up"></i>
                {{ question.upvotes.length }}
              </button>
              <button
                v-if="
                  (question.downvotes.indexOf(user) > -1 &&
                    $store.state.isLogin === false) ||
                    user == question.userId
                "
                type="button"
                class="btn btn-danger btn-sm ml-3"
                disabled
              >
                <i class="fas fa-arrow-down"></i>
                {{ question.downvotes.length }}
              </button>
              <button
                v-if="
                  question.downvotes.indexOf(user) < 0 &&
                    $store.state.isLogin === false
                "
                type="button"
                class="btn btn-outline-primary btn-sm ml-3"
                disabled
              >
                <i class="fas fa-arrow-down"></i>
                {{ question.downvotes.length }}
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- container answer -->
    <div class="container">
      <div class="container my-3">
        <h3>The answers . . .</h3>
      </div>
      <ul class="list-group">
        <li v-for="(answer, i) in answers" :key="answer._id" class="list-group-item">
          <div class="d-flex justify-content-end">{{ new Date(question.createdAt).toDateString() }}</div>
          <h4>
            <a class="nav-link">
              {{
              answer.title
              }}
            </a>
          </h4>
          <p>
            {{
            answer.description
            .split()
            .slice(0, 100)
            .join(",")
            }}
            . . .
          </p>
          <div class="d-flex justify-content-between">
            <div>
              <div class="sm">
                <small>
                  {{ countTime(new Date(), new Date(answer.createdAt)) }}
                  ago
                </small>
              </div>
              <div>user {{ answer.userId }}</div>
            </div>

            <div class="d-flex justify-content-end align-items-center">
              <button
                v-if="
                  answer.upvotes.indexOf(user) > -1 && $store.state.isLogin
                "
                type="button"
                class="btn btn-success btn-sm"
                @click="upvoteDownvote(i, 'upvotes')"
              >
                <i class="fas fa-arrow-up"></i>
                {{ answer.upvotes.length }}
              </button>
              <button
                v-if="
                  answer.upvotes.indexOf(user) < 0 &&
                    $store.state.isLogin &&
                    user !== answer.userId
                "
                type="button"
                class="btn btn-outline-success btn-sm"
                @click="upvoteDownvote(i, 'upvotes')"
              >
                <i class="fas fa-arrow-up"></i>
                {{ answer.upvotes.length }}
              </button>
              <button
                v-if="
                  answer.downvotes.indexOf(user) > -1 &&
                    $store.state.isLogin &&
                    user !== answer.userId
                "
                type="button"
                class="btn btn-danger btn-sm ml-3"
                @click="upvoteDownvote(i, 'downvotes')"
              >
                <i class="fas fa-arrow-down"></i>
                {{ answer.downvotes.length }}
              </button>
              <button
                v-if="
                  answer.downvotes.indexOf(user) < 0 &&
                    $store.state.isLogin &&
                    user !== answer.userId
                "
                type="button"
                class="btn btn-outline-danger btn-sm ml-3"
                @click="upvoteDownvote(i, 'downvotes')"
              >
                <i class="fas fa-arrow-down"></i>
                {{ answer.downvotes.length }}
              </button>
              <button
                v-if="
                  (answer.upvotes.indexOf(user) > -1 &&
                    $store.state.isLogin === false) ||
                    user === answer.userId
                "
                type="button"
                class="btn btn-secondary btn-sm"
                disabled
              >
                <i class="fas fa-arrow-up"></i>
                {{ answer.upvotes.length }}
              </button>
              <button
                v-if="
                  answer.downvotes.indexOf(user) < 0 &&
                    $store.state.isLogin === false
                "
                type="button"
                class="btn btn-outline-secondary btn-sm"
                disabled
              >
                <i class="fas fa-arrow-up"></i>
                {{ answer.upvotes.length }}
              </button>
              <button
                v-if="
                  (answer.downvotes.indexOf(user) > -1 &&
                    $store.state.isLogin === false) ||
                    user == answer.userId
                "
                type="button"
                class="btn btn-danger btn-sm ml-3"
                disabled
              >
                <i class="fas fa-arrow-down"></i>
                {{ answer.downvotes.length }}
              </button>
              <button
                v-if="
                  answer.downvotes.indexOf(user) < 0 &&
                    $store.state.isLogin === false
                "
                type="button"
                class="btn btn-outline-primary btn-sm ml-3"
                disabled
              >
                <i class="fas fa-arrow-down"></i>
                {{ answer.downvotes.length }}
              </button>
              <button
                v-if="
                user === answer.userId"
                @click="editanswer(answer)"
                type="button"
                class="btn btn-sm ml-3"
              >Edit</button>
              <button
                v-if="
                user === answer.userId"
                @click="delanswer(answer)"
                type="button"
                class="btn btn-danger btn-sm ml-3"
              >delete</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import swal from 'sweetalert2'
export default {
  name: "answerdetail",
  props: [],
  data() {
    return {
      user: localStorage.getItem("user"),
      question: {},
      answers: [],
      answertitle: "",
      answerdescription: "",
      updtarget: ""
    };
  },
  created() {
    this.getQuestion();
    this.getAllAnswer();
  },
  mounted() {
    this.getQuestion();
    this.getAllAnswer();
  },
  methods: {
    submitupdate(e){
      e.title = this.answertitle
      e.description = this.answerdescription
      this.updateAnswer(e)
    },
    editanswer(e){
    console.log("munculin modal")
    this.updtarget = e
    this.answertitle = e.title,
    this.answerdescription = e.description
    this.showeditform();
    },
    showeditform() {
      this.$refs["editanswer-modal"].show();
    },
    hideeditform() {
      this.$refs["editanswer-modal"].hide();
    },
    ud(e, type){
      let exist = false;
      let cancel = "";
      console.log(e)
      e[type].forEach((ud, j) => {
        if (ud === localStorage.getItem("user")) {
          exist = true;
          cancel = j;
        }
      });
      if (exist === false) {
        e[type].push(localStorage.getItem("user"));
        let opexist = false;
        let opcancel = "";
        let op = "";
        if (type === "upvotes") {
          e.downvotes.forEach((ud, j) => {
            if (ud === localStorage.getItem("user")) {
              opexist = true;
              opcancel = j;
              op = "downvotes";
            }
          });
        } else if (type === "downvotes") {
          e.upvotes.forEach((ud, j) => {
            if (ud === localStorage.getItem("user")) {
              opexist = true;
              opcancel = j;
              op = "upvotes";
            }
          });
        }
        if (opexist) {
          e[op].splice(opcancel, 1);
        }
      } else {
        e[type].splice(cancel, 1);
      }
      this.updateQuestion(e);
    },
    updateQuestion(updValue) {
      this.$axios({
        method: "put",
        url: "http://localhost:3000/question/" + updValue._id,
        headers: {
          token: localStorage.getItem("token"),
          id: localStorage.getItem("user")
        },
        data: updValue
      })
        .then(({ data }) => {
          console.log(data);
        })
        .catch(err => {
          this.getQuestion()
          this.getAllAnswer()
        });
    },
    delanswer(e) {
      console.log("delete")
      swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        })
        .then(result => {
          if (result.value) {
            this.$axios({
              method: "delete",
              url: "http://localhost:3000/answer/" + e._id,
              headers: {
                token: localStorage.getItem("token"),
                id: localStorage.getItem("user")
              }
            })
              .then(({ data }) => {
                this.getAllAnswer()
                this.getQuestion()
              })
              .catch(err => {
                swal.fire(
                  `Error : ${err.response.status}`,
                  `${err.response.data}`,
                  "success"
                );
                console.log(JSON.stringify(err));
              });
          }
        });
    },
    submitanswer() {
      console.log(this.answertitle);
      console.log(this.answerdescription);
      console.log("submit nih");
      this.$axios({
        method: "post",
        url: "http://localhost:3000/answer",
        headers: {
          token: localStorage.getItem("token"),
          id: localStorage.getItem("user")
        },
        data: {
          questionId: this.$route.params.id,
          userId: localStorage.getItem("user"),
          title: this.answertitle,
          description: this.answerdescription,
          upvotes: [],
          downvotes: []
        }
      })
        .then(({ data }) => {
          console.log(data);
          this.getAllAnswer()
          this.getQuestion()
          this.answertitle = ""
          this.answerdescription = ""
          this.hideanswerform()
        })
        .catch(err => {
          console.log(JSON.stringify(err));
        });
    },
    showanswerform() {
      this.$refs["newanswer-modal"].show();
    },
    hideanswerform() {
      this.$refs["newanswer-modal"].hide();
    },
    countTime(d1, d2) {
      let hours = Math.abs(d2 - d1) / 36e5;
      if (hours < 1) {
        return `${hours.toString()[2]}${hours.toString()[3]} minute`;
      } else if (hours < 24) {
        hours = Math.floor(hours);
        return `${hours} hour`;
      } else if (hours < 168) {
        hours = Math.floor(Math.abs(168 / hours));
        return `${hours} day`;
      } else if (hours < 672) {
        hours = Math.floor(Math.abs(672 / hours));
        return `${hours} week`;
      }
    },
    getQuestion() {
      console.log(this.$route.params.id);
      this.$axios({
        method: "get",
        url: "http://localhost:3000/question/" + this.$route.params.id
      })
        .then(({ data }) => {
          console.log(data);
          this.question = data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAllAnswer() {
      this.$axios({
        method: "get",
        url: "http://localhost:3000/answers/" + this.$route.params.id
      })
        .then(({ data }) => {
          console.log(data);
          this.answers = data;
        })
        .catch(err => {
          console.log(JSON.stringify(err));
        });
    },
    upvoteDownvote(i, type) {
      let exist = false;
      let allAnswers = this.answers;
      let answer = this.answers[i];
      let cancel = "";
      answer[type].forEach((ud, j) => {
        if (ud === localStorage.getItem("user")) {
          exist = true;
          cancel = j;
        }
      });
      if (exist === false) {
        answer[type].push(localStorage.getItem("user"));
        let opexist = false;
        let opcancel = "";
        let op = "";
        if (type === "upvotes") {
          answer.downvotes.forEach((ud, j) => {
            if (ud === localStorage.getItem("user")) {
              opexist = true;
              opcancel = j;
              op = "downvotes";
            }
          });
        } else if (type === "downvotes") {
          answer.upvotes.forEach((ud, j) => {
            if (ud === localStorage.getItem("user")) {
              opexist = true;
              opcancel = j;
              op = "upvotes";
            }
          });
        }
        if (opexist) {
          answer[op].splice(opcancel, 1);
        }
      } else {
        answer[type].splice(cancel, 1);
      }
      this.updateAnswer(answer);
    },
    updateAnswer(updValue) {
      this.$axios({
        method: "put",
        url: "http://localhost:3000/answer/" + updValue._id,
        headers: {
          token: localStorage.getItem("token"),
          id: localStorage.getItem("user")
        },
        data: updValue
      })
        .then(({ data }) => {
          console.log(data);
          this.getAllAnswer();
          this.hideeditform()
        })
        .catch(err => {
          swal.fire(
            `Error : ${err.response.status}`,
            `${err.response.data}`,
            "success"
          );
          console.log(err);
        });
    }
  }
};
</script>
