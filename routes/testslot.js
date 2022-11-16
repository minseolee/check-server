const express = require('express');
const router = express.Router();
const { TestSlot } = require("../models/TestSlot");

const { auth } = require("../middleware/auth");
const {Member} = require("../models/Member");

//=================================
//             Slot
//=================================


router.post("/upload", (req, res) => {
    const slot = new TestSlot(req.body)

    slot.save((err, doc) => {
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })
});

router.post("/getSlots", (req, res) => {
    TestSlot.find({ memberId: req.body.userId })
        .exec((err, slots) => {
            if(err) return res.json({ success: false, err })
            res.status(200).json({ success: true, slots })
        })
});

router.get("/getAllSlots", (req, res) => {
    TestSlot.find()
        .exec((err, slots) => {
            if(err) return res.json({ success: false, err })
            res.status(200).json({ success: true, slots })
        })
});

router.post("/remove", (req, res) => {
    const variable = req.body._id;

    TestSlot.deleteOne({_id: variable }, (err, doc) => {
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })
});


module.exports = router;
