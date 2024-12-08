const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const User = new Schema({
    UserID: {
        type: Number,
        unique: true
    },
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    PhoneNumber: {
        type: String,
        required: true
    },
    CurrentClass: {
        type: String,
        required: false
    },
    Gap: {
        type: String,
        required: false
    },
    isFaculty: {
        type: Boolean,
        required: true,
        default: false
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: { createdAt: 'TimeStamp', updatedAt: false }
});

// Apply the auto-increment plugin to the User
User.plugin(AutoIncrement, { inc_field: 'UserID', start_seq: 1 });

module.exports = mongoose.model('User ', User);