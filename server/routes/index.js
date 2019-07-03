const router = require(`express`).Router();

const user = require("./user");
const answer = require(`./answer`);
const question = require("./question");

router.get("/", function(req, res) {
  res.json("/ aja");
});

router.use("/users", user);
router.use("/answers", answer);
router.use("/questions", question);

module.exports = router;
