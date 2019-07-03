const router = require(`express`).Router();
const controller = require("../controllers/answer");
const { authentication, authorizationa } = require("../middlewares/auth");

router.get(`/answers/:id`, controller.all);
router.get(`/answer/:id`, controller.detail);

router.use(authentication);
router.post(`/answer`, controller.create);
router.delete(`/answer/:id`, authorizationa, controller.delete);
router.put(`/answer/:id`, authorizationa, controller.update);

module.exports = router;
