const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();


router.get('/decode-token', verifyToken, (req, res) => {
    const user = req.user;
    res.json({ message: `${user.role}` });
  });

module.exports = router;
