<template>
  <div class="answer">
    <div v-if="$route.params.id">
      <questiondetail
        @editquestion="emitedit"
        @delquestion="emitdelete"
        @loginfirst="$emit('loginfirst')"
      ></questiondetail>
    </div>
    <router-view v-if="!$route.params.id"></router-view>
  </div>
</template>


<script>
import questiondetail from "@/components/QuestionDetail.vue";
export default {
  name: "answer",
  components: {
    questiondetail
  },
  methods: {
    emitedit(e) {
      this.$emit("editquestion", e);
    },
    emitdelete(e) {
      this.$router.push("/");
      this.$emit("delquestion", e);
    }
  }
};
</script>
