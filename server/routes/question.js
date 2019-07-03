const router = require(`express`).Router();
const controller = require("../controllers/question");
const { authentication, authorizationq } = require("../middlewares/auth");

router.get(`/questions`, controller.all);
router.get(`/question/:id`, controller.detail);

router.use(authentication);
router.post(`/question`, controller.create);
router.put(`/question/:id`, authorizationq, controller.update);
router.delete(`/question/:id`, authorizationq, controller.delete);

module.exports = router;
