const Answer = require(`../models/answer`);

class cAnswer {
  static create(req, res) {
    Answer.create(req.body)
      .then(created => {
        res.status(201).json(created);
      })
      .catch(err => {
        res.status(500).json({ message: `internal server error` });
        console.log("create error => ", err);
      });
  }

  static delete(req, res) {
    Answer.findByIdAndDelete(req.params.id)
      .then(deleted => {
        res.status(200).json(deleted);
      })
      .catch(err => {
        res.status(500).json({ message: `internal server error` });
        console.log("delete error => ", err);
      });
  }

  static detail(req, res) {
    Answer.findById(req.params.id)
      .then(found => {
        if (found) {
          res.status(200).json(found);
        } else {
          res.status(400).json({ message: `that is not exists` });
        }
      })
      .catch(err => {
        res.status(500).json({ message: `internal server error` });
        console.log("find one error => ", err);
      });
  }

  static all(req, res) {
    let condition = {}
    if(req.params.id){
      condition = { questionId : req.params.id }
    }
    Answer.find(condition)
      .then(founds => {
        if (founds.length >= 1) {
          let asc = founds.sort((a, b) => {
            return a.createdAt - b.createdAt;
          });
          if (req.query.sort === "desc") {
            res.status(200).json(asc.reverse());
          } else {
            res.status(200).json(asc);
          }
        } else {
          res.status(200).json(founds);
        }
      })
      .catch(err => {
        res.status(500).json({ message: `internal server error` });
        console.log("find many error => ", err);
      });
  }

  static update(req, res) {
    Answer.findByIdAndUpdate(req.params.id, req.body)
      .then(updated => {
        res.status(200).json(updated);
      })
      .catch(err => {
        res.status(500).json({ message: `internal server error err` });
        console.log("update error => ", err);
      });
  }
}

module.exports = cAnswer;