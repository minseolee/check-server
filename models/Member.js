const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSchema = mongoose.Schema({
    userId: {
        type: String,
    },
    memberId: {
        type: String,
    },
    email: {
        type: String,
        unique: 1,
    },
    password: {
        type: String,
    },
    name: {
        type: String,
        maxlength: 50,
    },
    description: {
        type: String,
    },
    count: {
        type: Number,
        default: 0,
    },
    testing: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true})
const Member = mongoose.model('Member', memberSchema);

module.exports = { Member }