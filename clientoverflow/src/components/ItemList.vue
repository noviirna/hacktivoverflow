<template>
  <div class="container" :key="$store.isLogin">
    <div class="container">
      <ul class="list-group">
        <li class="list-group-item">
          <div class="d-flex justify-content-end">{{ new Date(item.createdAt) }}</div>
          <h4>
            <a
              href
              @click.prevent="$router.push(`/question/${item._id}`)"
              class="nav-link"
            >{{ item.title }}</a>
          </h4>
          <p>
            {{
            item.description
            .split()
            .slice(0, 100)
            .join(",")
            }}
            . . .
          </p>
          <div class="d-flex justify-content-between">
            <div>
              <div class="sm">
                <small>
                  {{ countddown }}
                  ago
                </small>
              </div>
              <div>Author : {{ item.userId.username }}</div>
              <div v-if="type =='question'">
                <span v-for="tag in item.tags" :key="tag" class="mr-1 badge badge-secondary">{{tag}}</span>
              </div>
            </div>
            <div class="d-flex justify-content-end align-items-center">
              <button
                v-if="item.userId._id !== user._id && !$route.params.id"
                type="button"
                class="btn btn-link btn-sm"
                @click.prevent="$router.push(`/question/${item._id}`)"
              >See Details</button>
              <button
                v-if="item.userId._id !== user._id && $route.params.id && type =='question'"
                type="button"
                class="btn btn-link btn-sm"
                @click.prevent="$emit('newanswer', {_id: item._id})"
              >Answer This</button>
              <button
                v-if="item.userId._id !== user._id && isLogin && upvoted"
                type="button"
                class="btn btn-success btn-sm"
                @click="upvoteDownvote('up')"
              >
                <i class="fas fa-arrow-up"></i>
                {{ item.upvotes.length }}
              </button>
              <button
                v-if="item.userId._id !== user._id && isLogin && !upvoted"
                type="button"
                class="btn btn-outline-success btn-sm"
                @click="upvoteDownvote('up')"
              >
                <i class="fas fa-arrow-up"></i>
                {{ item.upvotes.length }}
              </button>
              <button
                v-if="item.userId._id !== user._id && isLogin && downvoted"
                type="button"
                class="btn btn-danger btn-sm ml-3"
                @click="upvoteDownvote('down')"
              >
                <i class="fas fa-arrow-down"></i>
                {{ item.downvotes.length }}
              </button>
              <button
                v-if="item.userId._id !== user._id && isLogin && !downvoted"
                type="button"
                class="btn btn-outline-danger btn-sm ml-3"
                @click="upvoteDownvote('down')"
              >
                <i class="fas fa-arrow-down"></i>
                {{ item.downvotes.length }}
              </button>

              <button
                v-if="item.userId._id === user._id && item.upvotes.length > 0"
                type="button"
                class="btn btn-secondary btn-sm"
                disabled
              >
                <i class="fas fa-arrow-up"></i>
                {{ item.upvotes.length }}
              </button>
              <button
                v-if="(item.userId._id === user._id && item.upvotes.length == 0) || !isLogin"
                type="button"
                class="btn btn-outline-secondary btn-sm"
                disabled
              >
                <i class="fas fa-arrow-up"></i>
                {{ item.upvotes.length }}
              </button>
              <button
                v-if="item.userId._id === user._id && item.downvotes.length > 0"
                type="button"
                class="btn btn-danger btn-sm ml-3"
                disabled
              >
                <i class="fas fa-arrow-down"></i>
                {{ item.downvotes.length }}
              </button>
              <button
                v-if="(item.userId._id === user._id && item.downvotes.length == 0) || !isLogin"
                type="button"
                class="btn btn-outline-primary btn-sm ml-3"
                disabled
              >
                <i class="fas fa-arrow-down"></i>
                {{ item.downvotes.length }}
              </button>

              <button
                v-if="item.userId._id === user._id"
                @click="edit(item)"
                type="button"
                class="bt btn-secondary n btn-sm ml-3"
              >Edit</button>
              <button
                v-if="item.userId._id === user._id && this.type=='question'"
                @click="del(item)"
                type="button"
                class="btn btn-danger btn-sm ml-3"
              >delete</button>
            </div>
          </div>
        </li>
      </ul>
      <br />
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import swal from "sweetalert2";
import { mapState } from "vuex";
export default {
  name: "itemlist",
  props: ["item", "type"],
  data() {
    return {
      authors: []
    };
  },
  created() {},
  components: {},
  computed: {
    upvoted: function() {
      let upvoted = false;
      this.item.upvotes.forEach(like => {
        if (like == this.user._id) {
          upvoted = true;
        }
      });
      return upvoted;
    },
    downvoted: function() {
      let downvoted = false;
      this.item.downvotes.forEach(dislike => {
        if (dislike == this.user._id) {
          downvoted = true;
        }
      });
      return downvoted;
    },
    countddown: function() {
      var seconds = Math.floor(
        (new Date() - new Date(this.item.createdAt)) / 1000
      );

      var interval = Math.floor(seconds / 31536000);

      if (interval > 1) {
        return interval + " years";
      }
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
        return interval + " months";
      }
      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
        return interval + " days";
      }
      interval = Math.floor(seconds / 3600);
      if (interval > 1) {
        return interval + " hours";
      }
      interval = Math.floor(seconds / 60);
      if (interval > 1) {
        return interval + " minutes";
      }
      return Math.floor(seconds) + " seconds";
    },
    ...mapState(["user", "isLogin", "questions", "answers"])
  },
  methods: {
    upvoteDownvote(action) {
      let data = this.item;
      let { upvoted, downvoted } = this;
      if (upvoted && action == "down") {
        data.upvotes.splice(data.upvotes.indexOf(this.user._id), 1);
        data.downvotes.push(this.user._id);
      } else if (downvoted && action == "up") {
        data.downvotes.splice(data.downvotes.indexOf(this.user._id), 1);
        data.upvotes.push(this.user._id);
      } else if (upvoted && action == "up") {
        data.upvotes.splice(data.upvotes.indexOf(this.user._id), 1);
      } else if (downvoted && action == "down") {
        data.downvotes.splice(data.downvotes.indexOf(this.user._id), 1);
      } else if (!downvoted && !upvoted) {
        if (action == "up") {
          data.upvotes.push(this.user._id);
        } else {
          data.downvotes.push(this.user._id);
        }
      }
      if (this.type == "question") {
        this.$store.dispatch("UPDATE_QUESTION_LIKE", {
          _id: data._id,
          data: data
        });
      } else {
        this.$store.dispatch("UPDATE_ANSWER_LIKE", {
          _id: data._id,
          data: data
        });
      }
    },
    edit(data) {
      if (this.type == "question") {
        this.$emit("editquestion", data);
      } else {
        this.$emit("editanswer", data);
      }
    },
    del(data) {
      if (this.type == "question") {
        swal
          .fire({
            title: "Are you sure?",
            text: "Delete question?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          })
          .then(result => {
            if (result.value) {
              this.$store
                .dispatch("DELETE_QUESTION", this.item._id)
                .then(res => {
                  swal.fire(
                    "success",
                    `successfully delete your question with id : ${this.item._id} and titled ${this.item.title}`,
                    "success"
                  );
                  this.$router.push("/");
                })
                .catch(err => {
                  console.log(err);
                  console.log(err.response.data);
                  swal.fire("sorry", err.response.data.message, "error");
                });
            }
          });
      } else {
        swal
          .fire({
            title: "Are you sure?",
            text: "Delete answer?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          })
          .then(result => {
            if (result.value) {
              this.$store
                .dispatch("DELETE_ANSWER", this.item._id)
                .then(res => {
                  swal.fire(
                    "success",
                    `successfully delete your answer with id : ${this.item._id} and titled ${this.item.title}`,
                    "success"
                  );
                })
                .catch(err => {
                  console.log(err);
                  console.log(err.response.data);
                  swal.fire("sorry", err.response.data.message, "error");
                });
            }
          });
      }
    }
  }
};
</script>
