import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Detail from "./components/AnswerDetail.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/question/:id",
      name: "question",
      component: () =>
        import(/* webpackChunkName: "question" */ "./views/Answer.vue"),
      children: [
        {
          path: ":answerId",
          name: "answerdetail",
          component: Detail
        }
      ]
    }
  ]
});
