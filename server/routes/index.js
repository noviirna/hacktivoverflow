const router = require(`express`).Router();

const user = require("../controllers/userc");
const answer = require(`../controllers/answerc`);
const question = require("../controllers/questionc");

const { authentication, authorizationq, authorizationa } = require(`../middlewares/auth`);

router.post("/register", user.register);
router.post(`/login`, user.login);
router.get(`/get/:id`, user.getuser);


router.get(`/questions`, question.all);
router.get(`/answers/:id`, answer.all);

router.get(`/question/:id`, question.detail);

router.use(authentication);
router.get(`/answer/:id`, answer.detail);
router.post(`/question`, question.create);
router.put(`/question/:id`, question.update);
router.delete(`/question/:id`, authorizationq, question.delete);

router.put(`/answer/:id`, answer.update);
router.post(`/answer`, answer.create);
router.delete(`/answer/:id`, authorizationa, answer.delete);

module.exports = router;
