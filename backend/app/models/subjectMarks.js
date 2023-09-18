const mongoose = require('mongoose');

const userSubjectMarksSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  marks: Number,
});

const UserSubjectMarks = mongoose.model('UserSubjectMarks', userSubjectMarksSchema);

module.exports = UserSubjectMarks;
