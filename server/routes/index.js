const router = require(`express`).Router();

const user = require("./user");
const answer = require(`./answer`);
const question = require("./question");

router.use("/", user);
router.use("/", answer);
router.use("/", question);

module.exports = router;
