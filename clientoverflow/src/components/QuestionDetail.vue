<template>
  <div class="answerdetail">
    <b-modal hide-footer :title="modal" ref="answermodal">
      <div class="form-group">
        <label for="email">Answer Title</label>
        <input
          v-model="title"
          type="title"
          class="form-control"
          id="title"
          aria-describedby="emailHelp"
          placeholder="Answer Title"
        />
      </div>
      <div class="form-group">
        <label for="description">Answer Description</label>
        <textarea
          v-model="description"
          type="description"
          class="form-control"
          id="description"
          placeholder="Your Answer"
        ></textarea>
      </div>
      <b-button
        v-if="modal ==='Answer question'"
        @click="submitanswer"
        class="mt-2 form-control"
        variant="outline-success"
        block
      >Submit Answer</b-button>
      <b-button
        v-if="modal ==='Edit answer'"
        @click="editanswer"
        class="mt-2 form-control"
        variant="outline-success"
        block
      >Edit answer</b-button>
    </b-modal>
    <div class="container" v-if="question">
      <div class="container my-3">
        <h3>The question . . .</h3>
      </div>
      <list
        @editquestion="$emit('editquestion', question)"
        @newanswer="showanswerform"
        :item="question"
        :type="'question'"
      ></list>
      <div class="container my-3">
        <h3>The answers</h3>
      </div>
      <div v-for="answer in $store.state.answers" :key="answer._id">
        <list :item="answer" :type="'answer'" @editanswer="showanswerform"></list>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert2";
import list from "@/components/ItemList.vue";
import { mapState } from "vuex";
export default {
  name: "questiondetail",
  components: { list },
  props: [],
  data() {
    return {
      modal: "",
      title: "",
      description: "",
      answerId: "",
      questionId: ""
    };
  },
  created() {
    if (!this.question) {
      this.$router.push("/");
    } else {
      this.$store.dispatch("FETCH_ALL_ANSWERS", this.$route.params.id);
    }
  },
  mounted() {},
  computed: {
    ...mapState(["questions", "user", "answers"]),
    question: function() {
      let question = undefined;
      this.questions.forEach(q => {
        if (q._id == this.$route.params.id) {
          question = q;
        }
      });
      return question;
    },
    answers: function() {
      return [];
    }
  },
  mounted() {},
  methods: {
    editanswer() {
      if (this.title !== "" && this.description !== "") {
        this.$store
          .dispatch("UPDATE_ANSWER", {
            _id: this.answerId,
            data: {
              title: this.title,
              description: this.description
            }
          })
          .then(() => {
            swal.fire("that answer has been updated!");
            this.hideanswerform();
          })
          .catch(err => {
            console.log(err);
            console.log(err.response.data);
            swal.fire("sorry", err.response.data.message, "error");
          });
      }
    },
    submitanswer() {
      if (this.title == "" || this.description == "") {
      } else {
        swal
          .fire({
            title: "Confirmation",
            text: "Submit this answer",
            type: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Yes, submit it!"
          })
          .then(result => {
            if (result.value) {
              this.$store.dispatch("SUBMIT_ANSWER", {
                questionId: this.questionId,
                title: this.title,
                description: this.description,
                userId: this.user._id,
                upvotes: [],
                downvotes: []
              });
            }
          });
      }
    },
    showanswerform(e) {
      if (e.questionId) {
        this.answerId = e._id;
        this.questionId = e.questionId;
        this.modal = "Edit answer";
        this.title = e.title;
        this.description = e.description;
      } else {
        this.questionId = e._id;
        this.title = "";
        this.description = "";
        this.modal = "Answer question";
      }
      this.$refs["answermodal"].show();
    },
    hideanswerform() {
      this.title = "";
      this.description = "";
      this.$refs["answermodal"].hide();
    }
  }
};
</script>
