const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/User");
const  OTP  = require("../models/OTP");
const  Subjects  = require("../models/Subjects");
const  Chapters  = require("../models/Chapters");
const  Notes  = require("../models/Notes");
const  Questions  = require("../models/Questions");
const  QuestionPaper  = require("../models/QuestionPaper");

// For SMTP Mail Sending
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

router.get("/", async (req, res) => {
  res.json({ message: "Welcome to CETPREPAPP SERVER" });
});

// Creates a new Contact request on database
router.post("/emailotp", async (req, res) => {
  const bodyData = req.body;
  const GeneratedOTP = Math.floor(100000 + Math.random() * 900000).toString();
  const ExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
  bodyData.OTP = GeneratedOTP;
  bodyData.ExpiresAt = ExpiresAt;

  const message1 = {
    from: process.env.SMTP_USER,
    to: bodyData.Email,
    subject: `OTP for CET Prep App is ${GeneratedOTP}`,
    html: `<p>OTP for CET Prep App is ${GeneratedOTP}, it is valid for 5 minutes only</p>`,
  };
  console.log("otp generates", GeneratedOTP);
  if (bodyData.Email !== "") {
    console.log("Sending OTP to " + bodyData.Email);
    transporter.sendMail(message1, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    });
  }

  const createResponse = await OTP.create(bodyData);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Route for OTP verification
router.post("/verifyotp", async (req, res) => {
  const { Email, OTP: userOTP } = req.body;

  try {
    // Fetch the stored OTP and ExpiresAt from the database using the Email
    const user = await OTP.findOne({ Email }).sort({ TimeStamp: -1 });

    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    const { OTP: storedOTP, ExpiresAt } = user;

    // Check if the provided OTP matches the stored OTP and if it is still valid
    if (userOTP === storedOTP && new Date() < new Date(ExpiresAt)) {
      return res.status(200).json({ message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST APIs

// Creates a new User on database
router.post("/register", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await User.create(bodyData);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Verify User on database
router.post("/login", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await User.findOne({
    Email: bodyData.Email,
    Password: bodyData.Password,
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Verify User on database
router.post("/faculty-login", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await User.findOne({
    Email: bodyData.Email,
    Password: bodyData.Password,
    isFaculty: true
  });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Creates a new Subject
router.post("/addsubject", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await Subjects.create(bodyData);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Creates a new Chapter
router.post("/addchapter", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await Chapters.create(bodyData);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Creates a new Note
router.post("/addnote", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await Notes.create(bodyData);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Creates a new Question
router.post("/addquestion", async (req, res) => {
  const bodyData = req.body;
  const createResponse = await Questions.create(bodyData);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(createResponse);
});

// Creates a new QuestionPaper
router.post("/addquestionpaper", async (req, res) => {
  try {
    const bodyData = req.body;

    // Create the QuestionPaper entry
    const questionPaper = await QuestionPaper.create(bodyData);

    // Fetch 20 random unique questions
    const randomQuestions = await Questions.aggregate([{ $sample: { size: 20 } }]);

    // Create entries in QPQuestions for each question
    const qPQuestionsEntries = randomQuestions.map(question => ({
      QuestionPaperID: questionPaper.QuestionPaperID,
      QuestionID: question.QuestionID
    }));

    await QPQuestions.insertMany(qPQuestionsEntries);

    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });

    res.json({ questionPaper, addedQuestions: randomQuestions });
  } catch (error) {
    console.error("Error creating question paper with random questions:", error);
    res.status(500).json({ error: "Failed to create question paper" });
  }
});

// GET APIs

// Gets all the Subjects
router.get("/getsubjects", async (req, res) => {
  const subjectData = await Subjects.find().sort({ SubjectID: 1 });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(subjectData);
});

// Gets the Subject by id
router.get("/getsubject/:SubjectID", async (req, res) => {
  const subjectID = req.params.SubjectID;
  const subjectData = await Subjects.findById(subjectID).populate('chapters notes questions');
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(subjectData);
});

// Gets all the Chapters
router.get("/getchapters", async (req, res) => {
  const chapterData = await Chapters.find().sort({ ChapterID: 1 });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(chapterData);
});

// Gets the Chapter by id
router.get("/getchapter/:ChapterID", async (req, res) => {
  const ChapterID = req.params.ChapterID;
  const chapterData = await Chapters.findById(ChapterID).populate('subjects questions');
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(chapterData);
});

// Get Chapters by SubjectID
router.get("/getsubjectchapters/:SubjectID", async (req, res) => {
  const subjectID = req.params.SubjectID;
  const chapterData = await Chapters.find({ SubjectID: subjectID }).sort({ ChapterID: 1 });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(chapterData);
});

// Gets all the Notes
router.get("/getnotes", async (req, res) => {
  const noteData = await Notes.find().sort({ NoteID: 1 });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(noteData);
});

// Gets the Note by id
router.get("/getnote/:NoteID", async (req, res) => {
  const NoteID = req.params.NoteID;
  const noteData = await Notes.findById(NoteID).populate('subjects');
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(noteData);
});

// Get Notes by SubjectID
router.get("/getsubjectnotes/:SubjectID", async (req, res) => {
  const subjectID = req.params.SubjectID;
  const noteData = await Notes.find({ SubjectID: subjectID }).sort({ NoteID: 1 });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(noteData);
});

// Gets all the Questions
router.get("/getquestions", async (req, res) => {
  const questionData = await Questions.find().sort({ QuestionID: 1 });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(questionData);
});

// Gets the Question by id
router.get("/getquestion/:QuestionID", async (req, res) => {
  const questionID = req.params.QuestionID;
  const questionData = await Questions.findById(questionID).populate('subjects chapters');
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(questionData);
});

// Get Questions by SubjectID
router.get("/getsubjectquestions/:SubjectID", async (req, res) => {
  const subjectID = req.params.SubjectID;
  const questionData = await Questions.find({ SubjectID: subjectID }).sort({ QuestionID: 1 });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(questionData);
});

// Get Questions by ChapterID
router.get("/getchapterquestions/:ChapterID", async (req, res) => {
  const chapterID = req.params.ChapterID;
  const questionData = await Questions.find({ ChapterID: chapterID }).sort({ QuestionID: 1 });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(questionData);
});

// Gets all the QuestionPapers
router.get("/getquestionpapers", async (req, res) => {
  const questionPaperData = await QuestionPaper.find().sort({ QuestionPaperID: 1 });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(questionPaperData);
});

// Gets the QuestionPaper by id
router.get("/getquestionpaper/:QuestionPaperID", async (req, res) => {
  const questionPaperID = req.params.QuestionPaperID;

  try {
    const questionPaperData = await QuestionPaper.findById(questionPaperID).populate('user questionpaper.questionquestions');

    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });

    res.json(questionPaperData);
  } catch (error) {
    console.error("Error fetching question paper data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

// Get QuestionPapers by UserID
router.get("/getstudentquestionpapers/:User ID", async (req, res) => {
  const studentID = req.params.UserID;
  const questionPaperData = await QuestionPaper.find({ UserID: studentID }).sort({ QuestionPaperID: 1 });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(questionPaperData);
});

// Get all Faculties
router.get("/getallfaculties", async (req, res) => {
  const FacultyData = await User.find({ isFaculty: true });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(FacultyData);
});

// Get all Faculties who are not admins
router.get("/getonlyfaculties", async (req, res) => {
  const FacultyData = await User.find({ isFaculty: true, isAdmin: false });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(FacultyData);
});

// Get all Admins
router.get("/getalladmins", async (req, res) => {
  const FacultyData = await User.find({ isAdmin: true });
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(FacultyData);
});

// Get Faculty by id
router.get("/getfaculty/:User ID", async (req, res) => {
  const UserID = req.params.UserID;
  const FacultyData = await User.findById(UserID);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": " Origin, Content-Type, X-Auth-Token",
  });
  res.json(FacultyData);
});

// Get Student by id
router.get("/getstudent/:User ID", async (req, res) => {
  const UserID = req.params.UserID;
  const StudentData = await User.findById(UserID);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(StudentData);
});

// DELETE APIs

// Delete the Question by id
router.delete("/deletequestion/:QuestionID", async (req, res) => {
  const QuestionID = req.params.QuestionID;
  const QuestionData = await Questions.findByIdAndDelete(QuestionID);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(QuestionData);
});

// Delete User by id
router.delete("/deletefaculty/:User ID", async (req, res) => {
  const UserID = req.params.UserID;
  const FacultyData = await User.findByIdAndDelete(UserID);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(FacultyData);
});

// Delete User by id
router.delete("/deletestudent/:User ID", async (req, res) => {
  const UserID = req.params.UserID;
  const StudentData = await User.findByIdAndDelete(UserID);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(StudentData);
});

// Delete Subject by id
router.delete("/deletesubject/:SubjectID", async (req, res) => {
  const SubjectID = req.params.SubjectID;
  const SubjectData = await Subjects.findByIdAndDelete(SubjectID);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(SubjectData);
});

// Delete Chapter by id
router.delete("/deletechapter/:ChapterID", async (req, res) => {
  const ChapterID = req.params.ChapterID;
  const ChapterData = await Chapters.findByIdAndDelete(ChapterID);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(ChapterData);
});

// Delete Note by id
router.delete("/deletenote/:NoteID", async (req, res) => {
  const NoteID = req.params.NoteID;
  const NoteData = await Notes.findByIdAndDelete(NoteID);
  res.header({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
  });
  res.json(NoteData);
});

// Update APIs

// Updates Questions value
router.put("/updatequestion/:QuestionID", async (req, res) => {
  const QuestionID = req.params.QuestionID;
  const bodyData = req.body;
  const QuestionData = await Questions.findByIdAndUpdate(QuestionID, bodyData, { new: true });
  
  if (QuestionData) {
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(QuestionData);
  } else {
    res.status(404).json({ message: "Question not found" });
  }
});

// Updates User value
router.put("/updatestudent/:User ID", async (req, res) => {
  const UserID = req.params.UserID;
  const bodyData = req.body;
  const StudentData = await User.findByIdAndUpdate(UserID, bodyData, { new: true });

  if (StudentData) {
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(StudentData);
  } else {
    res.status(404).json({ message: "Student not found" });
  }
});

// Updates User value
router.put("/updatefaculty/:User ID", async (req, res) => {
  const UserID = req.params.UserID;
  const bodyData = req.body;
  const FacultyData = await User.findByIdAndUpdate(UserID, bodyData, { new: true });

  if (FacultyData) {
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(FacultyData);
  } else {
    res.status(404).json({ message: "Faculty not found" });
  }
});

// Make Faculty an admin
router.put("/makeadmin/:User ID", async (req, res) => {
  const UserID = req.params.UserID;
  const FacultyData = await User.findByIdAndUpdate(UserID, { isAdmin: true }, { new: true });

  if (FacultyData) {
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(FacultyData);
  } else {
    res.status(404).json({ message: "Faculty not found" });
  }
});

// Dismiss Faculty as admin
router.put("/dismissadmin/:User ID", async (req, res) => {
  const UserID = req.params.UserID;
  const FacultyData = await User.findByIdAndUpdate(UserID, { isAdmin: false }, { new: true });

  if (FacultyData) {
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(FacultyData);
  } else {
    res.status(404).json({ message: "Faculty not found" });
  }
});

// Updates Subject value
router.put("/updatesubject/:SubjectID", async (req, res) => {
  const SubjectID = req.params.SubjectID;
  const bodyData = req.body;
  const SubjectData = await Subjects.findByIdAndUpdate(SubjectID, bodyData, { new: true });

  if (SubjectData) {
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(SubjectData);
  } else {
    res.status(404).json({ message: "Subject not found" });
  }
});

// Updates Chapter value
router.put("/updatechapter/:ChapterID", async (req, res) => {
  const ChapterID = req.params.ChapterID;
  const bodyData = req.body;
  const ChapterData = await Chapters.findByIdAndUpdate(ChapterID, bodyData, { new: true });

  if (ChapterData) {
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(ChapterData);
  } else {
    res.status(404).json({ message: "Chapter not found" });
  }
});

// Updates Note value
router.put("/updatenote/:NoteID", async (req, res) => {
  const NoteID = req.params.NoteID;
  const bodyData = req.body;
  const NoteData = await Notes.findByIdAndUpdate(NoteID, bodyData, { new: true });

  if (NoteData) {
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(NoteData);
  } else {
    res.status(404).json({ message: "Note not found" });
  }
});

// Updates QuestionPaper value
router.put("/updatequestionpaper/:QuestionPaperID", async (req, res) => {
  const QuestionPaperID = req.params.QuestionPaperID;
  const bodyData = req.body;
  const QuestionPaperData = await QuestionPaper.findByIdAndUpdate(QuestionPaperID, bodyData, { new: true });

  if (QuestionPaperData) {
    res.header({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
    });
    res.json(QuestionPaperData);
  } else {
    res.status(404).json({ message: "QuestionPaper not found" });
  }
});

module.exports = router;