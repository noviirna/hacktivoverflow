<template>
  <div class="home">
    <div v-for="question in questions" :key="question._id">
      <QuestionList
        @edit="$emit('edit')"
        @del="$emit('del')"
        :question="question"
        :isLogin="isLogin"
      ></QuestionList>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import QuestionList from "@/components/QuestionList.vue";
import { mapState, mapActions } from "vuex";
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
    ...mapState(["questions", "isLogin"])
  },
  created() {
    this.FETCH_ALL_QUESTIONS();
  },
  mounted() {},
  methods: {
    ...mapActions(["FETCH_ALL_QUESTIONS"])
  }
};
</script>
