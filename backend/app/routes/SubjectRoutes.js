const express = require("express");
const subjectController = require("../controllers/subjectController")
const router = express.Router();
router.get("/getallsubjects",subjectController.getAllSubjects)
router.get("/getsubjectsstudent/:subjectId",subjectController.getUsersWithoutSubject)
router.get("/getstudentsubjects/:userId",subjectController.getSubjectsForStudent)
router.post("/addsubject", subjectController.addSubject);
router.post("/assignstudentsubject",subjectController.assignSubjectToStudent)
router.put("/updatemark",subjectController.updateMarks)
router.get("/:subjectId/students/:userId", subjectController.getStudentsInSubject);

module.exports = router;
