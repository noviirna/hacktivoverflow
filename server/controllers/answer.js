const Answer = require(`../models/answer`);

class Controller {
  static create(req, res, next) {
    let userId = {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email
    };

    Answer.create(req.body)
      .then(created => {
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
          title,
          description,
          createdAt,
          updatedAt,
          tags,
          questionId: req.body.question
        });
      })
      .catch(next);
  }

  static delete(req, res, next) {
    Answer.findByIdAndDelete(req.params.id)
      .then(deleted => {
        res.status(200).json(deleted);
      })
      .catch(next);
  }

  static detail(req, res, next) {
    Answer.findById(req.params.id)
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
    let condition = {};
    if (req.params.id) {
      condition = { questionId: req.params.id };
    }
    Answer.find(condition)
      .populate("userId")
      .then(founds => {
        if (founds.length >= 1) {
          let asc = founds.sort((a, b) => {
            return a.createdAt - b.createdAt;
          });
          if (req.query.sort === "asc") {
            res.status(200).json(asc);
          } else {
            res.status(200).json(asc.reverse());
          }
        } else {
          res.status(200).json(founds);
        }
      })
      .catch(next);
  }

  static update(req, res, next) {
    Answer.findByIdAndUpdate(req.params.id, req.body, {
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
