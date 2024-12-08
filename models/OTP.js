const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const OTPSchema = new Schema({
    ID: {
        type: Number,
        unique: true, // Ensure ID is unique
        // required: true // ID is required
    },
    Email: {
        type: String,
        required: true // Email is required
    },
    OTP: {
        type: String,
        required: true // OTP is required
    },
    ExpiresAt: {
        type: Date,
        required: true // ExpiresAt is required
    }
}, {
    timestamps: { createdAt: 'TimeStamp', updatedAt: false } // Create timestamps
});

// Apply the auto-increment plugin to the OTPSchema
OTPSchema.plugin(AutoIncrement, { inc_field: 'ID', start_seq: 1 });

module.exports = mongoose.model('OTP', OTPSchema);