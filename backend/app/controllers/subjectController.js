const Subject = require("../models/subject");
const User = require('../models/user');

const addSubject = async (req, res) => {
  try {
    const { name, minMarks } = req.body;
    const newSubject = new Subject({
      name,
      minMarks,
    });
    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);
  } catch (error) {
    console.error('Error adding subject:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getAllSubjects = async (req, res) => {
    try {
      const subjects = await Subject.find();
  
      res.status(200).json(subjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const getUsersWithoutSubject = async (req, res) => {
    try {
      const subjectId = req.params.subjectId;
      const subject = await Subject.findById(subjectId);
  
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
  
      const usersWithSubject = await User.find({ subjects: subjectId });
      const allStudents = await User.find({ role: 'user', activated: true, deleted: false});
      
      const usersWithoutSubject = allStudents.filter(user => !usersWithSubject.some(u => u._id.equals(user._id)));
  
      res.status(200).json(usersWithoutSubject);
    } catch (error) {
      console.error('Error fetching users without subject:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const assignSubjectToStudent = async (req, res) => {
    try {
      const { userId, subjectId } = req.body;
      const user = await User.findById(userId);
      const subject = await Subject.findById(subjectId);
      if (!user || !subject) {
        return res.status(404).json({ message: 'User or subject not found' });
      }
      user.subjects.push(subject);
      await user.save();
      res.status(200).json({ message: 'Subject assigned to student successfully' });
    } catch (error) {
      console.error('Error assigning subject to student:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateStudentMarks = async (req, res) => {
    try {
      const { userId, subjectName, newMarks } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const subjectToUpdate = user.subjects.find(subject => subject.name === subjectName);
      if (!subjectToUpdate) {
        return res.status(404).json({ message: `Subject '${subjectName}' not found for this user` });
      }
      subjectToUpdate.marks = newMarks;
      await user.save();
      res.status(200).json({ message: 'Student marks updated successfully' });
    } catch (error) {
      console.error('Error updating student marks:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = {
    addSubject,
    getAllSubjects,
    assignSubjectToStudent,
    getUsersWithoutSubject
};
