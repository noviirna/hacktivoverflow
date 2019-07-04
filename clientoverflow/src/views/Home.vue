<template>
  <div class="col-12 h-100">
    <div class="row d-flex justify-content-center my-2">
      <div class="col-12">
        <center>
          <h1>Hacktiv Overflow</h1>
        </center>
        <div v-if="isLogin">
          <span
            v-if="user.watchedTags.length < 1"
          >No watched Tags found, to add watched tag, just click on the tag on this question feeds</span>
          <small
            v-if="user.watchedTags.length > 0"
          >To add watched tag, just click on the tag on this question feeds. To remove it, just click the 'x' symbol on the tag below</small>
          <br />
          <div class="row m-0 p-0">
            <span class="badge badge-light mr-2" v-for="tag in user.watchedTags" :key="tag">
              {{tag}}&emsp;
              <i @click="rmTag(tag)" class="fa fa-times"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 mx-0">
      <b-tabs content-class="border border-top-0 pt-3" justified>
        <b-tab title="Feeds" active>
          <div v-for="question in questions" :key="question._id">
            <QuestionList
              @editquestion="$emit('editquestion', question)"
              @delquestion="$emit('delquestion', question)"
              :item="question"
              :type="'question'"
            ></QuestionList>
          </div>
        </b-tab>
        <div v-if="isLogin">
          <b-tab v-for="item in filters" :key="item.tag" :title="'Tagged: '+item.tag">
            <div v-for="question in item.questions" :key="question._id">
              <QuestionList
                @editquestion="$emit('editquestion', question)"
                @delquestion="$emit('delquestion', question)"
                :item="question"
                :type="'question'"
              ></QuestionList>
            </div>
          </b-tab>
        </div>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert2";
import QuestionList from "@/components/ItemList.vue";
import { mapState } from "vuex";
export default {
  name: "home",
  data() {
    return {
      viewOne: ""
    };
  },
  components: {
    QuestionList
  },
  computed: {
    ...mapState(["questions", "isLogin", "user"]),
    filters: function() {
      let questions = this.questions;
      let tags = this.user.watchedTags;
      let filterResult = [];

      tags.forEach((tag, i) => {
        let temp = {};
        temp.questions = [];
        temp.tag = tag;
        questions.forEach(question => {
          if (question.tags.indexOf(tag) !== -1) {
            temp.questions.push(question);
          }
        });
        filterResult.push(temp);
      });
      console.log(filterResult, "==============");
      return filterResult;
    }
  },
  created() {},
  mounted() {},
  methods: {
    rmTag(tag) {
      let { watchedTags } = this.user;
      swal
        .fire({
          title: "Are you sure?",
          text: `Remove "${tag}" from your watched tags?`,
          type: "warning",
          confirmButtonText: "Yes, remove it it!"
        })
        .then(result => {
          if (result.value) {
            watchedTags.splice(watchedTags.indexOf(tag), 1);
            this.$store
              .dispatch("CHANGE_WT", { watchedTags })
              .then(() => {
                swal.fire(`tag "${tag}" removed from your watched tags`);
              })
              .catch(err => {
                console.log(err);
                console.log(err.response.data);
                swal.fire("sorry", err.response.data.message, "error");
              });
          }
        });
    }
  }
};
</script>
