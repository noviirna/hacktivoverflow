const router = require(`express`).Router();

const user = require("../controllers/userc");
const answer = require(`../controllers/answerc`);
const question = require("../controllers/questionc");

const { authentication, authorizationq, authorizationa } = require(`../middlewares/auth`);

router.post("/register", user.register);
router.post(`/login`, user.login);

router.use(authentication);

router.get(`/questions`, question.all);
router.post(`/question`, question.create);
router.get(`/question/:id`, question.detail);
router.put(`/question/:id`, question.update);
router.delete(`/question/:id`, authorizationq, question.delete);

router.get(`/answers/:id`, answer.all);
router.post(`/answer`, answer.create);
router.get(`/answer/:id`, answer.detail);
router.put(`/answer/:id`, answer.update);
router.delete(`/answer/:id`, authorizationa, answer.delete);

module.exports = router;
