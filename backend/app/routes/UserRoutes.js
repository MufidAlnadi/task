const express = require("express");
const router = express.Router();
const usercontroller = require("../controllers/UserController");

router.post("/signup", usercontroller.signup);
router.post("/login", usercontroller.login);

router.get("/checkToken", usercontroller.authenticateToken, (req, res) => {
  res.send(req.user);
});
router.put("/activate", usercontroller.activateUser);
router.put("/delete", usercontroller.deleteUser);
router.get("/getallusers", usercontroller.getAllUsers);
router.get(":userId/role", usercontroller.getUserRoleById);
router.put("/update", usercontroller.updateUser);
router.get("/getadmin", usercontroller.getAdminUsers);

module.exports = router;
