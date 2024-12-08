const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const SubjectsSchema = new Schema({
    SubjectID: {
        type: Number,
        unique: true // Ensure SubjectID is unique
    },
    SubjectName: {
        type: String,
        required: true // SubjectName cannot be null
    }
}, {
    timestamps: { createdAt: 'TimeStamp', updatedAt: false } // Create a timestamp for createdAt
});

// Apply the auto-increment plugin to the SubjectsSchema
SubjectsSchema.plugin(AutoIncrement, { inc_field: 'SubjectID', start_seq: 1 });

module.exports = mongoose.model('Subjects', SubjectsSchema);