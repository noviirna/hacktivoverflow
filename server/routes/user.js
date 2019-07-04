const router = require(`express`).Router();
const controller = require("../controllers/user");
const { authentication } = require("../middlewares/auth");

router.post(`/register`, controller.register);
router.post(`/login`, controller.login);

router.use(authentication);
router.put(`/:id`, controller.update);

module.exports = router;
