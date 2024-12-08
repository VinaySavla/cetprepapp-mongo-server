const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const ChaptersSchema = new Schema({
    ChapterID: {
        type: Number,
        unique: true, // Ensure ChapterID is unique
        required: true // ChapterID is required
    },
    ChapterName: {
        type: String,
        required: true // ChapterName is required
    }
}, {
    timestamps: { createdAt: 'TimeStamp', updatedAt: false } // Create timestamps
});

// Apply the auto-increment plugin to the ChaptersSchema
ChaptersSchema.plugin(AutoIncrement, { inc_field: 'ChapterID', start_seq: 1 });

module.exports = mongoose.model('Chapters', ChaptersSchema);