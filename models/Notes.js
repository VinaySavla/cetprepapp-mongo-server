    const mongoose = require('mongoose');
    const AutoIncrement = require('mongoose-sequence')(mongoose);

    const Schema = mongoose.Schema;

    const NotesSchema = new Schema({
        NoteID: {
            type: Number,
            unique: true, // Ensure NoteID is unique
            // required: true // NoteID is required
        },
        DocumentLink: {
            type: String,
            required: true // DocumentLink is required
        }
    }, {
        timestamps: { createdAt: 'TimeStamp', updatedAt: false } // Create timestamps
    });

    // Apply the auto-increment plugin to the NotesSchema
    NotesSchema.plugin(AutoIncrement, { inc_field: 'NoteID', start_seq: 1 });

    module.exports = mongoose.model('Notes', NotesSchema);