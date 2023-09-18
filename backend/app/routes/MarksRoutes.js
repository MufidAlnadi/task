const express = require("express");
const marksController = require("../controllers/marksController")
const router = express.Router();

router.get("/getmarks/:userId/:subjectId",marksController.getMarksForUserSubject)
router.post("/postmark",marksController.postMarks)
module.exports = router;
