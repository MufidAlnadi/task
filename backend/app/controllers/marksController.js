const UserSubjectMarks = require('../models/subjectMarks');

const postMarks = async (req, res) => {
    try {
      const { userId, subjectId, marks } = req.body;
  
      // Check if a record for the same user and subject already exists
      const existingRecord = await UserSubjectMarks.findOne({ userId, subjectId });
  
      if (existingRecord) {
        // Update the existing record with the new marks
        existingRecord.marks = marks;
        await existingRecord.save();
      } else {
        // Create a new record
        const userSubjectMarks = new UserSubjectMarks({
          userId,
          subjectId,
          marks,
        });
        await userSubjectMarks.save();
      }
  
      res.status(201).json({ message: 'Marks posted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
const getMarksForUserSubject = async (req, res) => {
    try {
      const userId = req.params.userId;
      const subjectId = req.params.subjectId;
  
      // Find marks for the specified user and subject
      const marks = await UserSubjectMarks.find({ userId, subjectId });
      const markValue = marks.length > 0 ? marks[0].marks : 0;

      res.status(200).json({ mark: markValue });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

module.exports = { postMarks ,getMarksForUserSubject};
