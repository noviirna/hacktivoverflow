const router = require(`express`).Router();
const controller = require("../controllers/question");
const { authentication, authorizationq } = require("../middlewares/auth");

router.get(`/`, controller.all);
router.get(`/:id`, controller.detail);

router.use(authentication);
router.post(`/`, controller.create);
router.put(`/:id`, authorizationq, controller.update);
router.delete(`/:id`, authorizationq, controller.delete);

module.exports = router;
