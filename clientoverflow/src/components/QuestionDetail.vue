<template>
  <div class="answerdetail">
    <div class="container" v-if="question">
      <div class="container my-3">
        <h3>The question . . .</h3>
      </div>
      <questionlist
        @editquestion="$emit('editquestion', question)"
        @delquestion="$emit('delquestion', question)"
        :item="question"
        :type="'question'"
      ></questionlist>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert2";
import list from "@/components/ItemList.vue";
import { mapState } from "vuex";
export default {
  name: "answerdetail",
  components: { questionlist: list },
  props: [],
  data() {
    return {
      user: localStorage.getItem("user"),
      answers: [],
      answertitle: "",
      answerdescription: "",
      updtarget: ""
    };
  },
  created() {
    if (!this.question) {
      this.$router.push("/");
    }
  },
  mounted() {},
  computed: {
    ...mapState(["questions"]),
    question: function() {
      let question = undefined;
      this.questions.forEach(q => {
        if (q._id == this.$route.params.id) {
          question = q;
        }
      });
      return question;
    }
  },
  mounted() {},
  methods: {
    submitupdate(e) {
      e.title = this.answertitle;
      e.description = this.answerdescription;
      this.updateAnswer(e);
    },
    editanswer(e) {
      console.log("munculin modal");
      this.updtarget = e;
      (this.answertitle = e.title), (this.answerdescription = e.description);
      this.showeditform();
    },
    showeditform() {
      this.$refs["editanswer-modal"].show();
    },
    hideeditform() {
      this.$refs["editanswer-modal"].hide();
    },
    ud(e, type) {
      let exist = false;
      let cancel = "";
      console.log(e);
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
        url: "http://35.238.179.168/question/" + updValue._id,
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
          this.getQuestion();
          this.getAllAnswer();
        });
    },
    delanswer(e) {
      console.log("delete");
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
              url: "http://35.238.179.168/answer/" + e._id,
              headers: {
                token: localStorage.getItem("token"),
                id: localStorage.getItem("user")
              }
            })
              .then(({ data }) => {
                this.getAllAnswer();
                this.getQuestion();
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
        url: "http://35.238.179.168/answer",
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
          this.getAllAnswer();
          this.getQuestion();
          this.answertitle = "";
          this.answerdescription = "";
          this.hideanswerform();
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
      // console.log(this.$route.params.id);
      // this.$axios({
      //   method: "get",
      //   url: "http://35.238.179.168/question/" + this.$route.params.id
      // })
      //   .then(({ data }) => {
      //     console.log(data);
      //     this.question = data;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    getAllAnswer() {
      // this.$axios({
      //   method: "get",
      //   url: "http://35.238.179.168/answers/" + this.$route.params.id
      // })
      //   .then(({ data }) => {
      //     console.log(data);
      //     this.answers = data;
      //   })
      //   .catch(err => {
      //     console.log(JSON.stringify(err));
      //   });
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
        url: "http://35.238.179.168/answer/" + updValue._id,
        headers: {
          token: localStorage.getItem("token"),
          id: localStorage.getItem("user")
        },
        data: updValue
      })
        .then(({ data }) => {
          console.log(data);
          this.getAllAnswer();
          this.hideeditform();
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
