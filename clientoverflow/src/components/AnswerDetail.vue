<template>
  <div class="answerdetail">
    <div class="container">
      <h3>{{ this.$store.state.onequestion.title}}</h3>
      {{ this.$store.state.onequestion.description}}
      <div class="d-flex justify-content-between">
        <div>
          <div class="sm">
            <small>
              {{ countTime(new Date(), new Date(this.$store.state.onequestion.createdAt)) }}
              ago
            </small>
          </div>
          <div>user {{ this.$store.state.onequestion.userId }}</div>
        </div>

        <div class="d-flex justify-content-end align-items-center">
          <button
            v-if="
                  this.$store.state.onequestion.upvotes.indexOf(user) > -1 && this.$store.state.isLogin
                "
            type="button"
            class="btn btn-success btn-sm"
            @click="upvoteDownvote(i, 'upvotes')"
          >
            <i class="fas fa-arrow-up"></i>
            {{ this.$store.state.onequestion.upvotes.length }}
          </button>
          <button
            v-if="
                  this.$store.state.onequestion.upvotes.indexOf(user) < 0 &&
                    this.$store.state.isLogin &&
                    user !== this.$store.state.onequestion.userId
                "
            type="button"
            class="btn btn-outline-success btn-sm"
            @click="upvoteDownvote(i, 'upvotes')"
          >
            <i class="fas fa-arrow-up"></i>
            {{ this.$store.state.onequestion.upvotes.length }}
          </button>
          <button
            v-if="
                  this.$store.state.onequestion.downvotes.indexOf(user) > -1 &&
                    this.$store.state.isLogin &&
                    user !== this.$store.state.onequestion.userId
                "
            type="button"
            class="btn btn-danger btn-sm ml-3"
            @click="upvoteDownvote(i, 'downvotes')"
          >
            <i class="fas fa-arrow-down"></i>
            {{ this.$store.state.onequestion.downvotes.length }}
          </button>
          <button
            v-if="
                  this.$store.state.onequestion.downvotes.indexOf(user) < 0 &&
                    this.$store.state.isLogin &&
                    user !== this.$store.state.onequestion.userId
                "
            type="button"
            class="btn btn-outline-danger btn-sm ml-3"
            @click="upvoteDownvote(i, 'downvotes')"
          >
            <i class="fas fa-arrow-down"></i>
            {{ this.$store.state.onequestion.downvotes.length }}
          </button>
          <button
            v-if="
                  (this.$store.state.onequestion.upvotes.indexOf(user) > -1 &&
                    this.$store.state.isLogin === false) ||
                    user === this.$store.state.onequestion.userId
                "
            type="button"
            class="btn btn-secondary btn-sm"
            disabled
          >
            <i class="fas fa-arrow-up"></i>
            {{ this.$store.state.onequestion.upvotes.length }}
          </button>
          <button
            v-if="
                  this.$store.state.onequestion.downvotes.indexOf(user) < 0 &&
                    this.$store.state.isLogin === false
                "
            type="button"
            class="btn btn-outline-secondary btn-sm"
            disabled
          >
            <i class="fas fa-arrow-up"></i>
            {{ this.$store.state.onequestion.upvotes.length }}
          </button>
          <button
            v-if="
                  (this.$store.state.onequestion.downvotes.indexOf(user) > -1 &&
                    this.$store.state.isLogin === false) ||
                    user == this.$store.state.onequestion.userId
                "
            type="button"
            class="btn btn-danger btn-sm ml-3"
            disabled
          >
            <i class="fas fa-arrow-down"></i>
            {{ this.$store.state.onequestion.downvotes.length }}
          </button>
          <button
            v-if="
                  this.$store.state.onequestion.downvotes.indexOf(user) < 0 &&
                    this.$store.state.isLogin === false
                "
            type="button"
            class="btn btn-outline-primary btn-sm ml-3"
            disabled
          >
            <i class="fas fa-arrow-down"></i>
            {{ this.$store.state.onequestion.downvotes.length }}
          </button>
          <button
            v-if="
                user === this.$store.state.onequestion.userId"
            @click="edit"
            type="button"
            class="btn btn-sm ml-3"
          >Edit Question</button>
          <button
            v-if="
                user === this.$store.state.onequestion.userId"
            @click="del"
            type="button"
            class="btn btn-danger btn-sm ml-3"
          >Delete Question</button>
        </div>
      </div>
    </div>
    <!-- New Answer modal -->
    <b-modal hide-footer title="Write your answer here . . ." ref="newquestion-modal">
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
        <label for="description">Answer ...</label>
        <textarea
          v-model="description"
          type="description"
          class="form-control"
          id="description"
          placeholder="Your Question . . ."
        ></textarea>
      </div>
      <b-button @click="submitanswer" class="mt-2" variant="outline-success" block>Submit Answer</b-button>
    </b-modal>
  </div>
</template>

<script>
import swal from "sweetalert2";
export default {
  name: "answerdetail",
  data() {
    return {
      user: localStorage.getItem("user")
    };
  },
  mounted() {},
  methods: {
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
    edit() {
      this.$emit("edit", this.$store.state.onequestion);
    },
    del() {
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
            this.$emit("del", this.$store.state.onequestion);
          }
        });
    },
    getAnswers() {},
    postAnswers() {},
    deleteAnswers() {},
    upvoteDownvote() {}
  }
};
</script>
