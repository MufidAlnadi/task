const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();


router.get('/decode-token', verifyToken, (req, res) => {
    const user = req.user;
    const userArray = [
      {
          key: 'username',
          value: user.username
      },
      {
          key: 'email',
          value: user.email
      },
      {
        key: 'role',
        value: user.role
      },
      {
        key: 'id',
        value: user.user_id
      }
    ];  

  res.json({ user: userArray });
  });

 router.get("/getUserId", verifyToken, (req, res) => {
    const userId = req.user.user_id;
    res.json({ userId });
  });
module.exports = router;
