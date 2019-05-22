<template>
  <div class="answerdetail">
    <h1>This is an question detail page</h1>
    {{ $route.params.id }}
  </div>
</template>

<script>
export default {
  name: "answerdetail",
  props: [],
  data() {
    return {
      answers: []
    };
  },
  mounted() {
    this.getAllAnswer();
  },
  methods: {
    getAllAnswer() {}
  }
};
</script>
