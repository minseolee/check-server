const express = require('express');
const router = express.Router();
const { SubSlot } = require("../models/SubSlot");

const { auth } = require("../middleware/auth");
const {Member} = require("../models/Member");

//=================================
//             SubSlot
//=================================


router.post("/upload", (req, res) => {
    // 멤버생성
    const subslot = new SubSlot(req.body)
    subslot.save((err, doc) => {
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })
});

router.post("/getSlots", (req, res) => {
    // 멤버정보 DB에서 가져오기
    SubSlot.find({ userId: req.body.userId })
        .exec((err, subslots) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, subslots })
        })
});

router.get("/getAllSlots", (req, res) => {
    // 멤버정보 DB에서 가져오기
    SubSlot.find()
        .exec((err, subslots) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success: true, subslots })
        })
});

router.post("/delete", (req, res) => {
    // 멤버정보 DB에서 가져오기
    const variable = req.body._id;

    SubSlot.deleteOne({_id: variable }, (err, doc) => {
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })
});

router.post("/accept", (req, res) => {
    // 멤버정보 DB에서 가져오기
    const variable = req.body;

    SubSlot.deleteOne({
        userId: variable.userId,
        memberId: variable.memberId,
        email: variable.email,
        count: variable.count,
    }, (err, doc) => {
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })
});


module.exports = router;
