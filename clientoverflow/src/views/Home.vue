<template>
  <div class="home">
    <QuestionList
      @edit="edit"
      @del="del"
      :allQuestions="allQuestions"
      :isLogin="isLogin"
    ></QuestionList>
  </div>
</template>

<script>
// @ is an alias to /src
import QuestionList from "@/components/QuestionList.vue";
export default {
  name: "home",
  data() {
    return {
      isLogin: this.$store.state.isLogin,
      allQuestions: [],
      viewOne: ""
    };
  },
  components: {
    QuestionList
  },
  created() {
    this.getAllQuestions();
  },
  mounted() {},
  methods: {
    getAllQuestions() {
      this.$axios({
        method: "get",
        url: "http://35.238.179.168/questions"
      })
        .then(({ data }) => {
          this.allQuestions = data;
          this.$store.dispatch("questions", data);
        })
        .catch(({ response }) => {
          console.log(response);
        });
    },
    edit(e){
      this.$emit("edit", e);
    },
    del(e){
      this.$emit('del', e)
    }
  }
};
</script>
