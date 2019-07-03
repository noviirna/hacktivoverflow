<template>
  <div class="container" :key="$store.isLogin">
    <div class="container">
      <ul class="list-group">
        <li class="list-group-item">
          <div class="d-flex justify-content-end">{{ new Date(item.createdAt).toDateString() }}</div>
          <h4>
            <a href @click.prevent="seedetail(item._id)" class="nav-link">{{ item.title }}</a>
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
              <span v-for="tag in item.tags" :key="tag" class="mr-1 badge badge-secondary">{{tag}}</span>
            </div>
            <div class="d-flex justify-content-end align-items-center">
              <button
                v-if="item.userId._id !== user._id "
                type="button"
                class="btn btn-link btn-sm"
                @click.prevent="seedetail(item._id)"
              >Answer This</button>
              <button
                v-if="item.userId._id !== user._id && isLogin"
                type="button"
                class="btn btn-success btn-sm"
                @click="upvoteDownvote(i, 'upvotes')"
              >
                <i class="fas fa-arrow-up"></i>
                {{ item.upvotes.length }}
              </button>
              <button
                v-if="item.userId._id !== user._id && isLogin"
                type="button"
                class="btn btn-outline-success btn-sm"
                @click="upvoteDownvote(i, 'upvotes')"
              >
                <i class="fas fa-arrow-up"></i>
                {{ item.upvotes.length }}
              </button>
              <button
                v-if="item.userId._id !== user._id && isLogin"
                type="button"
                class="btn btn-danger btn-sm ml-3"
                @click="upvoteDownvote(i, 'downvotes')"
              >
                <i class="fas fa-arrow-down"></i>
                {{ item.downvotes.length }}
              </button>
              <button
                v-if="item.userId._id !== user._id && isLogin"
                type="button"
                class="btn btn-outline-danger btn-sm ml-3"
                @click="upvoteDownvote(i, 'downvotes')"
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
                v-if="item.userId._id === user._id"
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
    countddown: function() {
      let hours =
        Math.abs(new Date()) - new Date(this.item.createdAt) / 36e5 / 1000;

      let result = "";
      if (hours < 1) {
        result = `${hours.toString()[2]}${hours.toString()[3]} minute`;
      } else if (hours < 24) {
        hours = Math.floor(hours);
        result = `${hours} hour`;
      } else if (hours < 168) {
        hours = Math.floor(Math.abs(168 / hours));
        result = `${hours} day`;
      } else if (hours < 672) {
        hours = Math.floor(Math.abs(672 / hours));
        result = `${hours} week`;
      } else {
        hours = Math.ceil(Math.abs(8064 / hours));
        result = `${hours} month`;
      }
      return result;
    },
    ...mapState(["user", "isLogin", "questions", "answers"])
  },
  methods: {
    seedetail(id) {
      this.$router.push(`/question/${id}`);
    },
    checkUD(i, type) {
      let Question = this.questions[i];
      Question[type].forEach(ud => {
        if (ud === localStorage.getItem("user")) {
          return true;
        }
      });
      return false;
    },
    // upvoteDownvote(i, type) {
    //   let exist = false;
    //   let Question = this.questions[i];
    //   let cancel = "";
    //   Question[type].forEach((ud, j) => {
    //     if (ud === localStorage.getItem("user")) {
    //       exist = true;
    //       cancel = j;
    //     }
    //   });
    //   if (exist === false) {
    //     Question[type].push(localStorage.getItem("user"));
    //     let opexist = false;
    //     let opcancel = "";
    //     let op = "";
    //     if (type === "upvotes") {
    //       Question.downvotes.forEach((ud, j) => {
    //         if (ud === localStorage.getItem("user")) {
    //           opexist = true;
    //           opcancel = j;
    //           op = "downvotes";
    //         }
    //       });
    //     } else if (type === "downvotes") {
    //       Question.upvotes.forEach((ud, j) => {
    //         if (ud === localStorage.getItem("user")) {
    //           opexist = true;
    //           opcancel = j;
    //           op = "upvotes";
    //         }
    //       });
    //     }
    //     if (opexist) {
    //       Question[op].splice(opcancel, 1);
    //     }
    //   } else {
    //     Question[type].splice(cancel, 1);
    //   }
    //   this.updateQuestion(Question);
    // },
    // updateQuestion(updValue) {
    //   this.$axios({
    //     method: "put",
    //     url: "http://35.238.179.168/question/" + updValue._id,
    //     headers: {
    //       token: localStorage.getItem("token"),
    //       id: localStorage.getItem("user")
    //     },
    //     data: updValue
    //   })
    //     .then(({ data }) => {
    //       console.log(data);
    //     })
    //     .catch(err => {
    //       swal.fire(
    //         `Error : ${err.response.status}`,
    //         `${err.response.data}`,
    //         "success"
    //       );
    //       console.log(err);
    //     });
    // },
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
              this.$emit("delquestion", data);
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
              this.$emit("deleteanswer", data);
            }
          });
      }
    }
  }
};
</script>
