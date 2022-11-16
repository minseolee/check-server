const express = require('express');
const router = express.Router();
const { Member } = require("../models/Member");

const { auth } = require("../middleware/auth")

//=================================
//             Member
//=================================


router.post("/upload", (req, res) => {
    // 멤버생성
    const member = new Member(req.body)
    member.save((err, doc) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({ success: true })
    })
});

router.post("/getMembers", (req, res) => {
    // 멤버정보 DB에서 가져오기
    Member.find({ userId: req.body.userId })
        .exec((err, members) => {
            if(err) return res.json({ success: false, err })
            return res.status(200).json({ success: true,  members})
        })
});

router.post("/delete", (req, res) => {
    // 멤버생성
    Member.deleteOne({ _id: req.body._id })
        .exec((err, members) => {
            if(err) return res.json({ success: false, err })
            return res.status(200).json({ success: true, members })
        })
});

router.post("/login", (req, res) => {
    // 멤버생성
    Member.findOne({ email: req.body.email, password: req.body.password })
        .exec((err, member) => {
            if(err) res.json({ success: false, err })
            return res.status(200).json({ success: true, member })
        })
});

router.post("/testing", (req, res) => {
    // 멤버생성
    Member.update({ _id: req.body.memberId }, {testing: true})
        .exec((err, doc) => {
            if(err) res.json({ success: false, err })
            return res.status(200).json({ success: true })
        })
});

module.exports = router;
