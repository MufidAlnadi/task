const Subject = require("../models/subject");
const User = require("../models/user");
const mongoose = require("mongoose");

const addSubject = async (req, res) => {
  try {
    const { name, minMarks } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }
    const newSubject = new Subject({
      name,
      minMarks,
    });
    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);
  } catch (error) {
    console.error("Error adding subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({}, "_id name");
    const simplifiedSubjects = subjects.map((subject) => ({
      _id: subject._id,
      name: subject.name,
    }));

    res.status(200).json(simplifiedSubjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUsersWithoutSubject = async (req, res) => {
  try {
    const subjectId = req.params.subjectId;
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const usersWithoutSubject = await User.find(
      {
        role: "user",
        activated: true,
        deleted: false,
        subjects: { $nin: [subjectId] },
      },
      { _id: 1, username: 1 }
    );

    res.status(200).json(usersWithoutSubject);
  } catch (error) {
    console.error("Error fetching users without subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const assignSubjectToStudent = async (req, res) => {
  try {
    const { userId, subjectId } = req.body;
    const user = await User.findById(userId);
    const subject = await Subject.findById(subjectId);
    if (!user || !subject) {
      return res.status(404).json({ message: "User or subject not found" });
    }
    user.subjects.push(subject);
    await user.save();
    res
      .status(200)
      .json({ message: "Subject assigned to student successfully" });
  } catch (error) {
    console.error("Error assigning subject to student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSubjectsForStudent = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("subjects");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const subjects = user.subjects.map((subject) => ({
      _id: subject._id,
      name: subject.name,
      marks: subject.marks,
      minMarks: subject.minMarks,
    }));

    res.status(200).json(subjects);
  } catch (error) {
    console.error("Error fetching subjects for the student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getStudentsInSubject = async (req, res) => {
  try {
    const subjectId = req.params.subjectId;

    // Find all users who are students and are enrolled in the specified subject
    const studentsInSubject = await User.find({
      role: "user",
      activated: true,
      deleted: false,
      subjects: subjectId, // Check if subjectId is in the subjects array
    });

    res.status(200).json(studentsInSubject);
  } catch (error) {
    console.error("Error fetching students in subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateMarks = async (req, res) => {
  try {
    const { userId, subjectId, marks } = req.body;

    const user = await User.findById(userId).populate("subjects"); // Populate the subjects array
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const subjectToUpdate = user.subjects.find(
      (subject) => subject._id.toString() === subjectId
    );

    if (!subjectToUpdate) {
      return res
        .status(404)
        .json({ message: "Subject not found for this user" });
    }

    subjectToUpdate.marks = parseInt(marks, 10);

    await user.save();


    res.status(200).json({ message: "Marks updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  addSubject,
  getAllSubjects,
  assignSubjectToStudent,
  getUsersWithoutSubject,
  getSubjectsForStudent,
  updateMarks,
  getStudentsInSubject,
};
