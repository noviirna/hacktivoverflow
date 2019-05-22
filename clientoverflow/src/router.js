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
      path: "/answer",
      name: "answer",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "question" */ "./views/Answer.vue"),
      children: [
        {
          path: ":id",
          name: "answerdetail",
          component: Detail
        }
      ]
    }
  ]
});
