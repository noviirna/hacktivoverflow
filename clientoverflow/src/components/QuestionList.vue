<template>
  <div class="container" :key="$store.isLogin">
    <div v-for="(question, i) in $store.state.questions" :key="question._id" class="container">
      <ul class="list-group">
        <li class="list-group-item">
          <div class="d-flex justify-content-end">{{ new Date(question.createdAt).toDateString() }}</div>
          <h4>
            <a href @click.prevent="seedetail(question)" class="nav-link">
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
                @click.prevent="seedetail(question)"
              >Answer This</button>
              <button
                v-if="
                  question.upvotes.indexOf(user) > -1 && $store.state.isLogin
                "
                type="button"
                class="btn btn-success btn-sm"
                @click="upvoteDownvote(i, 'upvotes')"
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
                @click="upvoteDownvote(i, 'upvotes')"
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
                @click="upvoteDownvote(i, 'downvotes')"
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
                @click="upvoteDownvote(i, 'downvotes')"
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
              <button
                v-if="
                user === question.userId"
                @click="edit(question)"
                type="button"
                class="btn btn-sm ml-3"
              >Edit</button>
              <button
                v-if="
                user === question.userId"
                @click="del(question)"
                type="button"
                class="btn btn-danger btn-sm ml-3"
              >delete</button>
            </div>
          </div>
        </li>
      </ul>
      <br>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import swal from "sweetalert2";

export default {
  name: "QuestionList",
  props: ["allQuestions", "isLogin"],
  data() {
    return {
      user: localStorage.getItem("user"),
      authors: []
    };
  },
  created() {},
  components: {},
  methods: {
    seedetail(e) {
      this.$emit("detailquestion", e);
    },
    countTime(d1, d2) {
      let hours = Math.abs(d2 - d1) / 36e5;
      if (hours < 1) {
        return `${hours.toString()[0]}${hours.toString()[1]} minute`;
      } else if (hours < 24) {
        hours = Math.floor(hours);
        return `${hours} hour`;
      } else if (hours < 168) {
        hours = Math.abs(168 / hours);
        return `${hours} day`;
      } else if (hours < 672) {
        hours = Math.abs(672 / hours);
        return `${hours} week`;
      }
    },
    checkUD(i, type) {
      let Question = this.allQuestions[i];
      Question[type].forEach(ud => {
        if (ud === localStorage.getItem("user")) {
          return true;
        }
      });
      return false;
    },
    upvoteDownvote(i, type) {
      let exist = false;
      let allQuestions = this.allQuestions;
      let Question = this.allQuestions[i];
      let cancel = "";
      Question[type].forEach((ud, j) => {
        if (ud === localStorage.getItem("user")) {
          exist = true;
          cancel = j;
        }
      });
      if (exist === false) {
        Question[type].push(localStorage.getItem("user"));
        let opexist = false;
        let opcancel = "";
        let op = "";
        if (type === "upvotes") {
          Question.downvotes.forEach((ud, j) => {
            if (ud === localStorage.getItem("user")) {
              opexist = true;
              opcancel = j;
              op = "downvotes";
            }
          });
        } else if (type === "downvotes") {
          Question.upvotes.forEach((ud, j) => {
            if (ud === localStorage.getItem("user")) {
              opexist = true;
              opcancel = j;
              op = "upvotes";
            }
          });
        }
        if (opexist) {
          Question[op].splice(opcancel, 1);
        }
      } else {
        Question[type].splice(cancel, 1);
      }
      this.updateQuestion(Question);
      this.$store.dispatch("questions", this.allQuestions);
      // this.$forceUpdate()
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
          swal.fire(
            `Error : ${err.response.status}`,
            `${err.response.data}`,
            "success"
          );
          console.log(err);
        });
    },
    edit(data) {
      this.$emit("edit", data);
    },
    del(data) {
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
            this.$emit("del", data);  
          }
        });
    }
  }
};
</script>
