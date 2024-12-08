const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const QuestionsSchema = new Schema({
    QuestionID: {
        type: Number,
        unique: true // Ensure QuestionID is unique
    },
    Question: {
        type: String, // Use String for text
        required: true // Question cannot be null
    },
    OptionA: {
        type: String, // Use String for text
        required: true // OptionA cannot be null
    },
    OptionB: {
        type: String, // Use String for text
        required: true // OptionB cannot be null
    },
    OptionC: {
        type: String, // Use String for text
        required: true // OptionC cannot be null
    },
    OptionD: {
        type: String, // Use String for text
        required: true // OptionD cannot be null
    },
    CorrectOption: {
        type: String, // Use String for correct option
        required: true // CorrectOption cannot be null
    },
    Difficulty: {
        type: String, // Use String for difficulty level
        required: true // Difficulty cannot be null
    },
    isPYQ: {
        type: Boolean,
        required: true,
        default: false // Default value for isPYQ
    }
}, {
    timestamps: { createdAt: 'TimeStamp', updatedAt: true } // Create timestamps
});

// Apply the auto-increment plugin to the QuestionsSchema
QuestionsSchema.plugin(AutoIncrement, { inc_field: 'QuestionID', start_seq: 1 });

module.exports = mongoose.model('Questions', QuestionsSchema);