const express = require("express");
const subjectController = require("../controllers/subjectController")
const router = express.Router();

router.post("/addsubject", subjectController.addSubject);
router.get("/getallsubjects",subjectController.getAllSubjects)
router.post("/studentsubject",subjectController.assignSubjectToStudent)
module.exports = router;
