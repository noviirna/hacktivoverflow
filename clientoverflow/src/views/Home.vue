<template>
  <div class="col-12 h-100">
    <div class="row d-flex justify-content-center my-2">
      <h1>Hacktiv Overflow</h1>
      <div v-if="isLogin" class="col-12 d-flex justify-content-start my-1">
        <p class="mr-2">Watched Tags :</p>
        <p v-if="user.watchedTags.length < 1">No watched Tags found, to add watched tag, just click on the tag on this question feeds</p>
        <span class="mr-2" v-for="tag in user.watchedTags" :key="tag">{{tag}}</span>
      </div>
    </div>
    <div class="col-12">
      <div v-for="question in questions" :key="question._id">
        <QuestionList
          @editquestion="$emit('editquestion', question)"
          @delquestion="$emit('delquestion', question)"
          
          :item="question"
          :type="'question'"
        ></QuestionList>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
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
    ...mapState(["questions", "isLogin", "user"])
  },
  created() {},
  mounted() {}
};
</script>
