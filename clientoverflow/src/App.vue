<template>
  <div id="app">
    <div>
      <b-navbar
        toggleable="md"
        class="navbar navbar-expand-lg navbar-light bg-light"
      >
        <a class="navbar-brand">HacktivOverflow</a>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <!-- Left aligned nav items -->
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav></b-navbar-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item>Sign in</b-nav-item>
            <b-nav-item-dropdown right v-if="isLogin">
              <!-- Using 'button-content' slot -->
              <template slot="button-content">
                <em>user</em>
              </template>
              <b-dropdown-item>
                <router-link to="">My Answers</router-link>
              </b-dropdown-item>
              <b-dropdown-item>
                <router-link to="">My Questions</router-link>
              </b-dropdown-item>
              <b-dropdown-item>
                <router-link to="">Sign Out</router-link>
              </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <router-view />
  </div>
</template>

<script>
// @ is an alias to /src
// import swal from "sweetalert2";
// import { CronJob } from "cron";
import { mapState } from "vuex";

export default {
  name: "home",
  data() {
    return {};
  },
  created() {
    console.log("created");
  },
  mounted() {
    console.log("mounted");
  },
  computed: mapState(["isLogin"]),
  methods: {
    checklogin() {
      if (localStorage.getItem("token")) {
        this.$store.dispatch("isLogin", true);
      }
    }
  }
};
</script>
