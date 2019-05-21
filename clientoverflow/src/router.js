import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

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
      path: "/login",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "login" */ "./views/LoginRegister.vue")
    },
    {
      path: "/answers",
      name: "answers",
      component: () => {
        import(/* webpackChunkName: "answers" */ "./views/MyAnswers.vue");
      },
      children: [
        {
          path: "id",
          component: () => {
            import(/* webpackChunkName: "details" */ "./views/QuestionDetails.vue");
          }
        }
      ]
    },
    {
      path: "/questions",
      name: "questions",
      component: () =>
        import(/* webpackChunkName: "questions" */ "./views/MyQuestions.vue")
    }
  ]
});
