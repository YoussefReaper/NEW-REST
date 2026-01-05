const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const KEY = process.env.KEY;

exports.register = async (req, res) => {
    const {username, password, email} = req.body;
    if(!username || !password) return res.status(400).json({ message: 'Username and password are required'});

    try {
        const existing = await User.findOne({ username });
        if (existing) return res.status(401).json({ message: 'Username already taken'});
        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) return res.status(401).json({ message: 'Email already registered'});
        }
        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashed,
            ...(email ? { email } : {}),
            isVerified: true,
            isCompleted: true,
            customization: {}
        });
        const token = jwt.sign({ username: newUser.username, id: newUser._id}, KEY, {expiresIn: '15m'});
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 15 * 60 * 1000
        });
        await newUser.save();
        res.status(201).json({
            message: 'User created',
            accessToken: token
        });
    } catch(err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

exports.login = async (req, res) => {
    const {username,password, rememberMe} = req.body;
    if(!username||!password) return res.status(400).json({message: 'Username and password are required'});

    try {
        const user = await User.findOne({username});
        if(!user) return res.status(401).json({message:'Invalid credentials'});
        const valid = await bcrypt.compare(password, user.password);
        if(!valid) return res.status(401).json({message: 'Invalid credentials'});
        const accessToken = jwt.sign({ username: user.username, id: user._id}, KEY, {expiresIn: '15m'});
        const sessionId = crypto.randomBytes(16).toString('hex');
        const refreshToken = jwt.sign({
            username: user.username, id: user._id
        },
        KEY,
        {expiresIn: rememberMe? '30d' : '1d'});

        user.refreshTokens.push(refreshToken);
        user.sessionIds = user.sessionIds || [];
        user.sessionIds.push({ id: sessionId, token: refreshToken });
        await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            domain: ".aurocore.me",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("sessionId", sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            domain: ".aurocore.me",
            maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
        });

        res.status(200).json({message: "Logged in successfully", accessToken: accessToken, sessionId: sessionId});
    } catch(err) {
        res.status(500).json({ message: 'Server error', error: err.message});
    }
};

exports.refreshToken = async (req, res) => {
    const sessionId = req.cookies.sessionId || req.body.sessionId;
    if (!sessionId) return res.status(401).json({ message: 'No session ID'});

    try {
        const user = await User.findOne({ "sessionIds.id": sessionId });
        if (!user) return res.status(403).json({ message: 'Invalid session ID'});
        const sessionData = user.sessionIds.find(session => session.id === sessionId);
        if (!sessionData) return res.status(402).json({ message: 'Session not found' });
        const refreshToken = sessionData.token;
        jwt.verify(refreshToken, KEY, async(err, decoded) => {
            if (err) {
                user.sessionIds = user.sessionIds.filter(session => session.id !== sessionId);
                user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
                await user.save();
                return res.status(403).json({ message: 'Invalid session' });
            }
            const newAccessToken = jwt.sign(
                {username: decoded.username, id: decoded.id},
                KEY,
                {expiresIn: '15m'}
            );

            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                domain: ".aurocore.me",
                maxAge: 15 * 60 * 1000
            });

            res.json({message: "Access token refreshed", accessToken: newAccessToken});
        });
    } catch(err) {
        res.status(500).json({ message: 'Server error', error: err.message});
    };
};

exports.logout = async (req, res) => {
    const sessionId = req.cookies.sessionId || req.body.sessionId;
    if (!sessionId) return res.sendStatus(204);
    try {
        const user = await User.findOne({ "sessionIds.id": sessionId });
        if (user) {
            const sessionData = user.sessionIds.find(session => session.id === sessionId);
            if (sessionData) {
                const refreshToken = sessionData.token;
                user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
            }
            user.sessionIds = user.sessionIds.filter(session => session.id !== sessionId);
            await user.save();
        }
        res.clearCookie("sessionId", {httpOnly: true, secure: true, sameSite: 'none', domain: ".aurocore.me"});
        res.clearCookie("accessToken", {httpOnly: true, secure: true, sameSite: 'none', domain: ".aurocore.me"});
        res.sendStatus(204);
    } catch(err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.checkSession = async (req, res) => {
    const sessionId = req.cookies.sessionId || req.body.sessionId;
    if (!sessionId) return res.status(401).json({ message: 'No session ID' });

    try {
        const user = await User.findOne({ "sessionIds.id": sessionId });
        if (!user) return res.status(403).json({ message: 'Invalid session ID' });

        const sessionData = user.sessionIds.find(session => session.id === sessionId);
        if (!sessionData) return res.status(403).json({ message: 'Session not found' });

        res.status(200).json({ message: 'Session is valid', user: { id: user._id, username: user.username } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};