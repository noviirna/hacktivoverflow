<template>
  <div>
    <!-- Navigation -->
    <b-navbar toggleable="md" class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link to="/" class="navbar-brand">HacktivOverflow</router-link>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <!-- Left aligned nav items -->
      <b-navbar-nav class="my-auto" v-if="isLogin">
        <small>
          <a @click="$emit('navnewquestion')">
            New Question
            <i class="fas fa-plus"></i>
          </a>
        </small>
      </b-navbar-nav>
      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right v-if="!isLogin">
            <!-- Using 'button-content' slot -->
            <template slot="button-content">Log In / Register</template>
            <b-dropdown-item>
              <a href @click.prevent="$emit('navlogin')">Login</a>
            </b-dropdown-item>
            <b-dropdown-item>
              <a href @click.prevent="$emit('navregister')">Register</a>
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown right v-if="isLogin">
            <!-- Using 'button-content' slot -->
            <template slot="button-content">{{ user.username }}</template>
            <b-dropdown-item>
              <a href @click.prevent="logout">Sign Out</a>
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import swal from "sweetalert2";
import { mapState } from "vuex";
export default {
  name: "navbar",
  data() {
    return {};
  },
  computed: {
    ...mapState(["isLogin", "user"])
  },
  methods: {
    logout() {
      localStorage.clear();
      swal.fire(`Success Logging out from ${this.user.username}`);
      this.$store.commit("SET_ISLOGIN", { status: false, user: {} });
    }
  }
};
</script>

<style></style>
