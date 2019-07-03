const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    title: String,
    description: String,
    tags: [String],
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;
