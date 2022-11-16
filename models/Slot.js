const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slotSchema = mongoose.Schema({
    userId: {
        type: String,
    },
    memberId: {
        type: String,
    },
    email: {
        type: String,
    },
    name: {
        type: String,
    },
    rankKeyword: {
        type: String,
        default: "",
    },
    keyword: {
        type: String,
        default: "",
    },
    oneMID: {
        type: String,
        default: "",
    },
    multiMID: {
        type: String,
        default: "",
    },
    extend: {
        type: Boolean,
        default: false,
    },
    expireDate: {
        type: Number,
        default: () => Date.now() + 30*24*60*60*1000,
    },
}, {timestamps: true})
const Slot = mongoose.model('Slot', slotSchema);

module.exports = { Slot }