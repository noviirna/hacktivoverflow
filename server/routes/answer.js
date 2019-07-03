const router = require(`express`).Router();
const controller = require("../controllers/answer");
const { authentication, authorizationa } = require("../middlewares/auth");

router.get(`/:id`, controller.all);
router.get(`/detail/:id`, controller.detail);

router.use(authentication);
router.post(`/`, controller.create);
router.delete(`/:id`, authorizationa, controller.delete);
router.put(`/:id`, authorizationa, controller.update);

module.exports = router;
