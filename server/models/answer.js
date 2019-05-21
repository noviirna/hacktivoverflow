const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question"
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    title: String,
    description: String,
    upvotes: Array,
    downvotes: Array
  },
  { timestamps: true }
);

const Answer = mongoose.model("Answer", AnswerSchema);
module.exports = Answer;
