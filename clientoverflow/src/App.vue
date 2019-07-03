<template>
  <div id="app">
    <!-- Question Modal -->
    <b-modal hide-footer :title="modal" ref="questionmodal">
      <div class="form-group">
        <label for="email">Question Title</label>
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
        <label for="description">Question Description</label>
        <textarea
          v-model="description"
          type="description"
          class="form-control"
          id="description"
          placeholder="Your Question . . ."
        ></textarea>
      </div>
      <div class="form-group">
        <label for="tag">Question Tags</label>
        <br />
        <input
          v-model="tag"
          type="text"
          class="form-control"
          id="tag"
          placeholder="Insert Question Tag"
          @keyup.space="addTag"
          @keyup.enter="addTag"
        />
        <small
          class="my-1"
        >type the tags and press space or enter to add tag, click the tag to remove it</small>
        <span
          v-for="tag in tags"
          :key="tag"
          @click="removeTag(tag)"
          class="badge badge-secondary mr-2"
        >{{tag}}</span>
      </div>
      <b-button
        v-if="modal ==='Write new question, ' + user.username"
        @click="submitquestion"
        class="mt-2 form-control"
        variant="outline-success"
        block
      >Submit Question</b-button>
      <b-button
        v-if="modal ==='Edit this question: ' + questionId"
        @click="editquestion"
        class="mt-2 form-control"
        variant="outline-success"
        block
      >Edit Question</b-button>
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
    <!-- navbar -->
    <navbar
      @navnewquestion="showQuestionModal"
      @navlogin="showLoginModal"
      @navregister="showRegisterModal"
    />
    <router-view @editquestion="showQuestionModal" />
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
      modal: "",
      title: "",
      description: "",
      username: "",
      email: "",
      password: "",
      questionId: "",
      tags: [],
      tag: ""
    };
  },
  created() {
    this.$store.dispatch("checkLogin");
    this.$store.dispatch("FETCH_ALL_QUESTIONS");
  },
  mounted() {},
  computed: {
    ...mapState(["isLogin", "user"])
  },
  methods: {
    showQuestionModal(emit) {
      if (!emit) {
        this.modal = "Write new question, " + this.user.username;
        this.title = "";
        this.description = "";
        this.questionId = "";
        this.tags = [];
        this.tag = "";
      } else {
        this.modal = "Edit this question: " + emit._id;
        this.title = emit.title;
        this.description = emit.description;
        this.questionId = emit._id;
        this.tags = emit.tags;
        this.tag = "";
      }
      this.$refs["questionmodal"].show();
    },
    hideQuestionModal() {
      this.title = "";
      this.description = "";
      this.questionId = "";
      this.tags = [];
      this.tag = "";
      this.$refs["questionmodal"].hide();
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

    showRegisterModal() {
      this.$refs["register-modal"].show();
    },
    hideRegisterModal() {
      this.$refs["register-modal"].hide();
      this.username = "";
      this.email = "";
      this.password = "";
    },

    // TAG RELATED =>
    addTag() {
      if (this.tag !== " ") {
        if (this.tags.indexOf(this.tag) === -1) {
          if (this.tag.length > 12 || this.tag.length < 3) {
            swal.fire("Tags should consists of 3 - 12 characters");
          } else {
            if (this.tags.length == 5) {
              swal.fire("Maximal tags is 5 tag per item");
            } else {
              this.tags.push(this.tag.toLowerCase());
            }
          }
        }
      }
      this.tag = "";
    },
    removeTag(tag) {
      let arr = this.tags;
      let index = "";
      for (let i = 0; i < this.tags.length; i++) {
        if (this.tags[i] == tag) {
          index = i;
        }
      }
      this.tags.splice(index, 1);
    },

    // USER RELATED => FUNGSINYA DI STORE
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

    // QUESTION RELATED => FUNGSI NYA DI STORE
    submitquestion() {
      if (this.title !== "" || this.description !== "" || this.tags !== []) {
        this.$store
          .dispatch("SUBMIT_QUESTION", {
            userId: this.user._id,
            title: this.title,
            description: this.description,
            tags: this.tags,
            upvotes: [],
            downvotes: []
          })
          .then(() => {
            this.hideQuestionModal();
            swal.fire("success submitting new question");
          })
          .catch(err => {
            console.log(err);
            console.log(err.response.data);
            swal.fire("sorry", err.response.data.message, "error");
          });
      }
    },
    editquestion() {
      this.$store
        .dispatch("UPDATE_QUESTION", {
          _id: this.questionId,
          data: {
            title: this.title,
            description: this.description,
            tags: this.tags
          }
        })
        .then(() => {
          swal.fire("that question has been updated!");
          this.hideQuestionModal();
        })
        .catch(err => {
          console.log(err);
          console.log(err.response.data);
          swal.fire("sorry", err.response.data.message, "error");
        });
    }
  }
};
</script>
