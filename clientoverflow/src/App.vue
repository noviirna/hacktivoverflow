<template>
  <div id="app">
    <!-- Edit modal -->
    <b-modal hide-footer title="Write your question here . . ." ref="editquestion-modal">
      <div class="form-group">
        <label for="email">Title ...</label>
        <input
          v-model="title"
          type="title"
          class="form-control"
          id="title"
          aria-describedby="emailHelp"
          placeholder="Question Title . . ."
        />
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
        />
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
      <b-button @click="submitquestion" class="mt-2" variant="outline-success" block>Submit Question</b-button>
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
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          id="password"
          placeholder="Enter password"
        />
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
        />
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
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="password" type="password" class="form-control" placeholder="Enter password" />
      </div>
      <b-button @click="register" class="mt-2" variant="outline-success" block>Register</b-button>
    </b-modal>
    <navbar
      @navnewquestion="showNewQuestionModal"
      @navlogin="showLoginModal"
      @navregister="showRegisterModal"
    />
    <router-view :key="$store.state.isLogin" @edit="showEditModal" @del="del" />
  </div>
</template>

<script>
import navbar from "@/components/Navbar.vue";
import swal from "sweetalert2";
import { mapState } from "vuex";

export default {
  name: "app",
  components: { navbar },
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
    this.$store.dispatch("checkLogin");
  },
  mounted() {},
  computed: mapState(["isLogin", "user"]),
  methods: {
    del(e) {
      this.questionId = e._id;
      this.$axios({
        method: "delete",
        url: "http://35.238.179.168/question/" + this.questionId,
        headers: {
          token: localStorage.getItem("token"),
          id: localStorage.getItem("user")
        }
      })
        .then(({ data }) => {
          this.questionId = "";
          this.$store.dispatch("FETCH_ALL_QUESTIONS");
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
    // MODAL RELATED
    showEditModal(emit) {
      this.title = emit.title;
      this.description = emit.description;
      this.questionId = emit._id;
      this.$refs["editquestion-modal"].show();
    },
    hideEditModall() {
      this.$refs["editquestion-modal"].hide();
    },
    showLoginModal() {
      this.$refs["login-modal"].show();
    },
    hideLoginModal() {
      this.$refs["login-modal"].hide();
      this.username = "";
      this.email = "";
      this.password = "";
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
      this.username = "";
      this.email = "";
      this.password = "";
    },

    // REGISTER LOGIN
    register() {
      let { username, email, password } = this;
      if (username == "" || email == "" || password == "") {
        swal.fire("please complete the form");
      } else {
        this.$store
          .dispatch("registering", { username, email, password })
          .then(data => {
            swal.fire(
              "success",
              `success creating ${data.username}`,
              "success"
            );
            this.hideRegisterModal();
            setTimeout(() => {
              this.email = data.email;
              this.showLoginModal();
            }, 500);
          })
          .catch(err => {
            console.log(err);
            console.log(JSON.stringify(err));
            console.log(JSON.stringify(err.response));
            swal.fire("sorry", err.response.data.message, "error");
          });
      }
    },
    login() {
      if (this.email === "" || this.password === "") {
        swal.fire("please complete the form");
      } else {
        this.$store
          .dispatch("loggingIn", { email: this.email, password: this.password })
          .then(data => {
            swal.fire(`hello ${data.username}!`);
            this.email = "";
            this.password = "";
            this.hideLoginModal();
          })
          .catch(err => {
            swal.fire("sorry", err.response.data.message, "error");
          });
      }
    },

    submitquestion() {
      this.$store
        .dispatch("SUBMIT_QUESTION", {
          userId: this.user._id,
          title: this.title,
          description: this.description,
          upvotes: [],
          downvotes: []
        })
        .then(() => {
          this.title = "";
          this.description = "";
          this.hideNewQuestionModal();
          swal.fire("success submitting new question");
        })
        .catch(err => {
          console.log(err);
          console.log(err.response.data);
          swal.fire("sorry", err.response.data.message, "error");
        });
    },
    editquestion() {
      this.$axios({
        method: "put",
        url: "http://35.238.179.168/question/" + this.questionId,
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
          this.$store.dispatch("FETCH_ALL_QUESTIONS");
          this.hideEditModall();
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
  }
};
</script>
