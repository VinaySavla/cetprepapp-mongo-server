const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

// Define the Result schema as an object
const ResultSchema = new Schema({
    score: {
        type: Number,
        required: true // Assuming score is required
    },
    totalQuestions: {
        type: Number,
        required: true // Assuming totalQuestions is required
    },
    correctAnswers: {
        type: Number,
        required: true // Assuming correctAnswers is required
    },
    // Add any other fields you need for the Result object
});

const QuestionPaperSchema = new Schema({
    QuestionPaperID: {
        type: Number,
        unique: true // Ensure QuestionPaperID is unique
    },
    Result: {
        type: ResultSchema, // Use the ResultSchema for the Result field
        required: false // Result can be null
    }
}, {
    timestamps: { createdAt: 'TimeStamp', updatedAt: false } // Create timestamps
});

// Apply the auto-increment plugin to the QuestionPaperSchema
QuestionPaperSchema.plugin(AutoIncrement, { inc_field: 'QuestionPaperID', start_seq: 1 });

module.exports = mongoose.model('QuestionPaper', QuestionPaperSchema);