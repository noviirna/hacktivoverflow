const Question = require(`../models/question`);

class Controller {
  static create(req, res, next) {
    Question.create(req.body)
      .then(created => {
        let userId = {
          _id: req.user._id,
          username: req.user.username,
          email: req.user.email
        };
        let {
          _id,
          upvotes,
          downvotes,
          title,
          description,
          createdAt,
          updatedAt,
          tags
        } = created;
        res.status(201).json({
          _id,
          upvotes,
          downvotes,
          userId,
          title,
          description,
          createdAt,
          updatedAt,
          userId,
          tags
        });
      })
      .catch(next);
  }

  static delete(req, res, next) {
    Question.findByIdAndDelete(req.params.id)
      .then(deleted => {
        res.status(200).json(deleted);
      })
      .catch(next);
  }

  static detail(req, res, next) {
    Question.findById(req.params.id)
      .then(found => {
        if (found) {
          res.status(200).json(found);
        } else {
          res.status(400).json({ message: `that is not exists` });
        }
      })
      .catch(next);
  }

  static all(req, res, next) {
    Question.find()
      .populate("userId")
      .populate("upvotes")
      .populate("downvotes")
      .then(founds => {
        if (founds.length >= 1) {
          let asc = founds.sort((a, b) => {
            return a.createdAt - b.createdAt;
          });
          //
          asc.forEach(question => {
            let { _id, username, email } = question.userId;
            question.userId = { _id, username, email };
            question.upvotes.forEach(upvote => {
              let { _id, username, email } = upvote;
              upvote = { _id, username, email };
            });
            //
            question.downvotes.forEach(downvote => {
              let { _id, username, email } = downvote;
              downvote = { _id, username, email };
            });
          });
          //
          if (req.query.sort === "asc") {
            res.status(200).json(asc);
          } else {
            res.status(200).json(asc.reverse());
          }
        } else {
          next({ code: 404, mesage: "no question found" });
        }
      })
      .catch(next);
  }

  static update(req, res, next) {
    Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      useFindAndModify: false
    })
      .then(updated => {
        res.status(200).json(updated);
      })
      .catch(next);
  }
}

module.exports = Controller;
