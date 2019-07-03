const router = require(`express`).Router();
const controller = require("../controllers/answer");
const { authentication, authorizationa } = require("../middlewares/auth");

router.get(`/:id`, controller.all);
// router.get(`/:id`, controller.detail);

router.use(authentication);
router.post(`/`, controller.create);
router.put(`/:id`, authorizationa, controller.update);
router.put(`/ud/:id`, controller.update);
router.delete(`/:id`, authorizationa, controller.delete);

module.exports = router;
