const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

exports.forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({message: "User not found"});

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenHashed = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordToken = resetTokenHashed;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        await sendEmail(
            user.email,
            "Password Reset Request",
            `Click here to reset your password: ${resetUrl}`
        );

        res.json({ message: "Reset link sent to email"});
    } catch(err) {
        res.status(500).json({message: err.message});
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({message: "Token invalid or expired"});

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.forgotUsername = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({ email});
        if (!user) return res.status(404).json({message: "User not found"});

        await sendEmail(
            user.email,
            "Your Username",
            `Your username is: ${user.username}`
        );

        res.json({ message: "Username sent to email" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};