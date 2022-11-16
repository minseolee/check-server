const express = require('express');
const router = express.Router();
const { Slot } = require("../models/Slot");

const { auth } = require("../middleware/auth");
const {Member} = require("../models/Member");

//=================================
//             Slot
//=================================


router.post("/upload", (req, res) => {
    const slot = new Slot(req.body)

    slot.save((err, doc) => {
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })
});

router.post("/getSlots", (req, res) => {
    Slot.find({ userId: req.body.userId })
        .exec((err, slots) => {
            if(err) return res.json({ success: false, err })
            res.status(200).json({ success: true, slots })
        })
});

router.get("/getAllSlots", (req, res) => {
    Slot.find()
        .exec((err, slots) => {
            if(err) return res.json({ success: false, err })
            res.status(200).json({ success: true, slots })
        })
});

router.post("/memberSlot", (req, res) => {
    Slot.find({ email: req.body.email })
        .exec((err, slots) => {
            if(err) return res.json({ success: false, err })
            res.status(200).json({ success: true, slots })
        })
});

router.post("/getExtend", (req, res) => {
    Slot.find({ userId: req.body.userId, extend: true })
        .exec((err, slots) => {
            if(err) return res.json({ success: false, err })
            res.status(200).json({ success: true, slots })
        })
});

router.post("/getDetail", (req, res) => {
    Slot.findOne({ _id: req.body.slotId })
        .exec((err, slot) => {
            if(err) return res.json({ success: false, err })
            res.status(200).json({ success: true, slot })
        })
});

router.post("/update", (req, res) => {
    const variable = req.body;
    Slot.update({ _id: variable._id }, { keyword: variable.keyword, rankKeyword: variable.rankKeyword, oneMID: variable.oneMID, multiMID: variable.multiMID })
        .exec((err, doc) => {
            if(err) return res.json({ success: false, err })
            res.status(200).json({ success: true })
        })
});

router.post("/extend", (req, res) => {
    const variable = req.body;
    Slot.update({ _id: variable._id }, { extend: true })
        .exec((err, doc) => {
            if(err) return res.json({ success: false, err })
            res.status(200).json({ success: true })
        })
});

router.post("/expired", (req, res) => {
    const variable = req.body;
    Slot.update({ _id: variable._id }, { extend: false })
        .exec((err, doc) => {
            if(err) return res.json({ success: false, err })
            res.status(200).json({ success: true })
        })
});


router.get("/getExpired", (req, res) => {
    const date = Date.now() + 2*24*60*60*1000;
    Slot.find({ expireDate: { $lte: date } })
        .exec((err, slots) => {
            if(err) return res.json({ success: false, err })
            res.status(200).json({ success: true, slots})
        })
});

router.post("/count", (req, res) => {
    Slot.find({ email: req.body.email })
        .exec((err, slots) => {
            if(err) return res.json({ success: false, err })
            res.status(200).json({ success: true, slots })
        })
});

module.exports = router;
