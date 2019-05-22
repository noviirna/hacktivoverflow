<template>
  <div class="answer">
    <router-view :key="this.$store.state.onequestion" @del="del" @edit="edit" ></router-view>
  </div>
</template>

<script>
export default {
  name : "answer",
  methods : {
    del(e){
      this.$emit('del', e)
    },
    edit(e){
      this.$emit('edit', e)
    }
  }
}

</script>