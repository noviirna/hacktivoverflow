<template>
  <div id="app">
    <div>
      <!-- Edit modal -->
      <b-modal hide-footer title="Edit your question here . . ." ref="editquestion-modal">
        <div class="form-group">
          <label for="email">Title ...</label>
          <input
            v-model="title"
            type="title"
            class="form-control"
            id="title"
            aria-describedby="emailHelp"
            placeholder="Question Title . . ."
          >
        </div>
        <div class="form-group">
          <label for="description">Question ...</label>
          <textarea
            v-model="description"
            type="description"
            class="form-control"
            id="description"
            placeholder="Your Question . . ."
          ></textarea>
        </div>
        <b-button @click="editquestion" class="mt-2" variant="outline-success" block>Edit Question</b-button>
      </b-modal>
      <!-- New Question modal -->
      <b-modal hide-footer title="Write your question here . . ." ref="newquestion-modal">
        <div class="form-group">
          <label for="email">Title ...</label>
          <input
            v-model="title"
            type="title"
            class="form-control"
            id="title"
            aria-describedby="emailHelp"
            placeholder="Question Title . . ."
          >
        </div>
        <div class="form-group">
          <label for="description">Question ...</label>
          <textarea
            v-model="description"
            type="description"
            class="form-control"
            id="description"
            placeholder="Your Question . . ."
          ></textarea>
        </div>
        <b-button
          @click="submitquestion"
          class="mt-2"
          variant="outline-success"
          block
        >Submit Question</b-button>
      </b-modal>
      <!-- Login modal -->
      <b-modal hide-footer title="Log in to Participate" ref="login-modal">
        <div class="form-group">
          <label for="email">Email address</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
          >
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            id="password"
            placeholder="Enter password"
          >
        </div>
        <b-button @click="login" class="mt-2" variant="outline-success" block>Log In</b-button>
      </b-modal>
      <!-- Register modal -->
      <b-modal hide-footer title="New to us? Register to join us!" ref="register-modal">
        <div class="form-group">
          <label for="email">Username</label>
          <input
            v-model="username"
            type="username"
            class="form-control"
            id="username"
            placeholder="Enter username"
          >
        </div>
        <div class="form-group">
          <label for="email">Email address</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
          >
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Enter password"
          >
        </div>
        <b-button @click="register" class="mt-2" variant="outline-success" block>Log In</b-button>
      </b-modal>
      <!-- Navigation -->
      <b-navbar toggleable="md" class="navbar navbar-expand-lg navbar-light bg-light">
        <router-link to="/" class="navbar-brand">HacktivOverflow</router-link>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <!-- Left aligned nav items -->
        <b-navbar-nav class="my-auto" v-if="isLogin">
          <small>
            <a @click="showNewQuestionModal">
              New Question
              <i class="fas fa-plus"></i>
            </a>
          </small>
        </b-navbar-nav>
        <b-collapse id="nav-collapse" is-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right v-if="isLogin === false">
              <!-- Using 'button-content' slot -->
              <template slot="button-content">Log In / Register</template>
              <b-dropdown-item>
                <a href @click="showLoginModal">Login</a>
              </b-dropdown-item>
              <b-dropdown-item>
                <a href @click="showRegisterModal">Register</a>
              </b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown right v-if="isLogin">
              <!-- Using 'button-content' slot -->
              <template slot="button-content">Account</template>
              <b-dropdown-item>
                <a href @click.prevent="logout">Sign Out</a>
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <br>
    <router-view
      :key="$store.state.isLogin || $store.state.questions || $store.state.onequestion"
      @edit="edit"
      @detail="detailquestion"
      @del="del"
    ></router-view>
  </div>
</template>

<script>
// @ is an alias to /src
// import { CronJob } from "cron";
import swal from "sweetalert2";
import { mapState } from "vuex";

export default {
  name: "app",
  data() {
    return {
      title: "",
      description: "",
      username: "",
      email: "",
      password: "",
      questionId: ""
    };
  },
  created() {
    console.log("created");
  },
  mounted() {
    console.log("mounted");
    this.checklogin();
  },
  computed: mapState(["isLogin"]),
  methods: {
    edit(e) {
      this.showEditModal();
      this.title = e.title;
      this.description = e.description;
      this.questionId = e._id;
    },
    del(e){
      this.questionId = e._id
      this.$axios({
        method: "delete",
        url: "http://localhost:3000/question/" + this.questionId,
        headers: {
          token: localStorage.getItem("token"),
          id: localStorage.getItem("user")
        }
      })
        .then(({ data }) => {
          this.questionId = ""
          this.getAllQuestions();
        })
        .catch(err => {
          swal.fire(
            `Error : ${err.response.status}`,
            `${err.response.data}`,
            "success"
          );
          console.log(JSON.stringify(err));
        });
    },
    editquestion() {
      console.log(this.$route.id);
      this.$axios({
        method: "put",
        url: "http://localhost:3000/question/" + this.questionId,
        headers: {
          token: localStorage.getItem("token"),
          id: localStorage.getItem("user")
        },
        data: {
          title: this.title,
          description: this.description
        }
      })
        .then(({ data }) => {
          this.title = "";
          this.description = "";
          this.getAllQuestions();
          console.log(data);
          this.hideEditModall();
          this.$router.push("/");
          swal.fire("updated","question updated","success")
        })
        .catch(err => {
          swal.fire(
            `Error : ${err.response.status}`,
            `${err.response.data}`,
            "success"
          );
          console.log(JSON.stringify(err));
        });
    },
    showEditModal() {
      this.$refs["editquestion-modal"].show();
    },
    hideEditModall() {
      this.$refs["editquestion-modal"].hide();
    },
    checklogin() {
      if (localStorage.getItem("token")) {
        this.$store.dispatch("isLogin", true);
      }
    },
    showLoginModal() {
      this.$refs["login-modal"].show();
    },
    hideLoginModal() {
      this.$refs["login-modal"].hide();
    },
    login() {
      if (this.email === "" || this.password === "") {
        swal.fire("please complete the form");
      } else {
        this.$axios({
          method: "post",
          url: "http://localhost:3000/login",
          data: {
            email: this.email,
            password: this.password
          }
        })
          .then(({ data }) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", data.user);
            this.$store.dispatch("isLogin", true);
            this.username = "";
            this.email = "";
            this.password = "";
            this.hideLoginModal();
            swal.fire("logged in")
          })
          .catch(err => {
            this.hideLoginModal();
            swal.fire("password / email wrong");
            console.log(err);
          });
      }
    },
    showNewQuestionModal() {
      this.$refs["newquestion-modal"].show();
    },
    hideNewQuestionModal() {
      this.$refs["newquestion-modal"].hide();
    },
    showRegisterModal() {
      this.$refs["register-modal"].show();
    },
    hideRegisterModal() {
      this.$refs["register-modal"].hide();
    },
    register() {
      if (this.email === "" || this.password === "") {
        swal.fire("please complete the form");
      } else {
        this.$axios({
          method: "post",
          url: "http://localhost:3000/register",
          data: {
            username: this.username,
            email: this.email,
            password: this.password
          }
        })
          .then(({ data }) => {
            this.username = "";
            this.password = "";
            swal.fire(
              "success",
              `success creating ${data.username}`,
              "success"
            );
            this.hideRegisterModal();
            setTimeout(() => {
              this.showLoginModal();
            }, 500);
          })
          .catch(({ response }) => {
            this.hideLoginModal();
            if (response.status === 400) {
              swal.fire("error", response.data.message, "error");
            } else {
              swal.fire("error", "internal server error", "error");
            }
            setTimeout(() => {
              this.$router.go(0);
            }, 1000);
            console.log(response);
          });
      }
    },
    logout() {
      this.$store.dispatch("isLogin", false);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.$router.replace("/");
      swal.fire("logged out")
    },
    detailquestion(e) {
      console.log("di app");
      this.openQuestion(e);
    },
    openQuestion(e) {
      let url = "/answer/" + e._id;
      this.$store.dispatch('onequestion',e)
      this.$router.push(url);
    },
    getAllQuestions() {
      this.$axios({
        method: "get",
        url: "http://localhost:3000/questions"
      })
        .then(({ data }) => {
          this.allQuestions = data;
          this.$store.dispatch("questions", data);
        })
        .catch(({ response }) => {
          console.log(response);
        });
    },
    submitquestion() {
      this.$axios({
        method: "post",
        url: "http://localhost:3000/question",
        headers: {
          token: localStorage.getItem("token"),
          id: localStorage.getItem("user")
        },
        data: {
          title: this.title,
          description: this.description,
          upvotes: [],
          downvotes: [],
          userId: localStorage.getItem("user")
        }
      })
        .then(({ data }) => {
          console.log(data);
          this.title = "";
          this.description = "";
          this.hideNewQuestionModal();
          this.getAllQuestions();
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
