const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subslotSchema = mongoose.Schema({
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
    name: {
        type: String,
    },
    count: {
        type: Number,
    },
    confirm: {
        type: Boolean,
    }
}, {timestamps: true})
const SubSlot = mongoose.model('SubSlot', subslotSchema);

module.exports = { SubSlot }