const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please provide a valid email address'
        ],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6
    }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password helper
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
