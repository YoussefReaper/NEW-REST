const User = require('../models/User');
const { Resend } = require('resend');
const crypto = require('crypto');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendVerificationEmail = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: 'User not found'});

        if (user.isVerified) {
            return res.status(400).json({message: 'Email already verified'});
        }

        const token = crypto.randomBytes(32).toString('hex');
        user.emailVerificationToken = token;
        user.emailVerificationExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
        await resend.emails.send({
            from: 'AuroCore <noreply@aurocore.me>',
            to: user.email,
            subject: 'Verify your email',
            html: `<h2>Welcome to AuroCore</h2>
                   <p>Please verify your email by clicking the link below:</p>
                   <a href="${verificationUrl}">${verificationUrl}</a>
                   <p>This link will expire in 1 hour.</p>`
        });

        res.json({message: 'Verification email sent'});
    } catch (err) {
        res.status(500).json({message: 'Error sending verification email'});
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now()}
        });

        if (!user) {
            return res.status(400).json({message: 'Invalid or expired token'});
        }

        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();
        res.json({message: 'Email verified successfully'});
    } catch (err) {
        res.status(500).json({message: 'Error verifying email'});
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('memories')
            .populate('tasks')
            .populate('trackers');
        if(!user) return res.status(404).json({message: 'User not found'});

        res.json({
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            isCompleted: user.isCompleted,
            profilePicture: user.profilePicture,
            profileDescription: user.profileDescription,
            aiName: user.aiName,
            aiProfilePicture: user.aiProfilePicture,
            aiPersonality: user.aiPersonality,
            aiDescription: user.aiDescription,
            subscription: user.subscription,
            achievements: user.achievements,
        });
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
};

exports.updateCustomization = async (req, res) => {
    try {
        const allowedFields = [
            'themeMode', 'colorPalette', 'backgrounds',
            'trackerBackgrounds', 'chatAppearance',
            'preferences', 'topbarTheme'
        ];
        const updates = {};
        if (req.body.settings) {
            let settings;
            try {
                settings = JSON.parse(req.body.settings);
            } catch (err) {
                return res.status(400).json({ message: 'Invalid JSON in settings' });
            }

            allowedFields.forEach(field => {
                if (settings[field] !== undefined) {
                    updates[`customization.${field}`] = settings[field];
                }
            });
        }
        if (req.files) {
            if (req.files['backgrounds_desktop']) {
                updates['customization.backgrounds.desktop'] = req.files['backgrounds_desktop'][0].path;
            }
            if (req.files['backgrounds_mobile']) {
                updates['customization.backgrounds.mobile'] = req.files['backgrounds_mobile'][0].path;
            }
            if (req.files['chat_background']) {
                updates['customization.chatAppearance.background'] = req.files['chat_background'][0].path;
            }
            if (req.files['tracker_desktop_main']) {
                updates['customization.trackerBackgrounds.desktop_main'] = req.files['tracker_desktop_main'][0].path;
            }
            if (req.files['tracker_desktop_pause']) {
                updates['customization.trackerBackgrounds.desktop_pause'] = req.files['tracker_desktop_pause'][0].path;
            }
            if (req.files['tracker_mobile_main']) {
                updates['customization.trackerBackgrounds.mobile_main'] = req.files['tracker_mobile_main'][0].path;
            }
            if (req.files['tracker_mobile_pause']) {
                updates['customization.trackerBackgrounds.mobile_pause'] = req.files['tracker_mobile_pause'][0].path;
            }
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Customization updated successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'server error', error: err.message });
    }
};


exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: 'User not found'});
        const { profileDescription, aiName, aiDescription, aiPersonality, displayName, username } = req.body;

        if (req.files && req.files.profilePicture) {
            user.profilePicture = req.files.profilePicture[0].path;
        }

        if (req.files && req.files.aiProfilePicture) {
            user.aiProfilePicture = req.files.aiProfilePicture[0].path;
        }
        if (await User.findOne({ username })) return res.status(400).json({message: 'Username already exists'});
        user.username = username || user.username;
        user.displayName = displayName || user.displayName;
        user.profileDescription = profileDescription || user.profileDescription;
        user.aiName = aiName || user.aiName;
        user.aiDescription = aiDescription || user.aiDescription;
        user.aiPersonality = aiPersonality || user.aiPersonality;
        await user.save();
        if (!user.isCompleted) {
            user.isCompleted = true;
            await user.save();
        }
        res.status(201).json({message: 'Profile updated'});
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
};

exports.updateSubscription = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: 'User not found'});
        user.subscription = req.body.subscription || user.subscription;
        await user.save();
        res.status(201).json({message: 'Subscription updated'});
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
};

exports.changeCoins = async (req,res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: 'User not found'});
        user.coins += req.body.coins || 0;
        await user.save();
        res.status(201).json({message: 'Coins changed successfully'});
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
};

exports.getCustomizations = async (req,res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: 'User not found'});
        res.json({
            themeMode: user.customization.themeMode,
            colorPalette: user.customization.colorPalette,
            backgrounds: user.customization.backgrounds,
            trackerBackgrounds: user.customization.trackerBackgrounds,
            chatAppearance: user.customization.chatAppearance,
            preferences: user.customization.preferences,
            topbarTheme: user.customization.topbarTheme
        });
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
};

exports.updateColors = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: 'User not found'});
        user.customization.colorPalette.light = req.body.colorPalette.light || user.customization.colorPalette.light;
        user.customization.colorPalette.dark = req.body.colorPalette.dark || user.customization.colorPalette.dark;
        await user.save();
        res.status(201).json({message: 'Colors updated successfully'});
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
}

exports.updateBackgrounds = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: 'User not found'});
        if (req.body.backgroundType === "Normal") {
            if (req.body.backgroundDevice === "Desktop") {
                user.customization.backgrounds.desktop = req.files.backgrounds_desktop[0].path || user.customization.backgrounds.desktop;
            } else if (req.body.backgroundDevice === "Mobile") {
                user.customization.backgrounds.mobile = req.files.backgrounds_mobile[0].path || user.customization.backgrounds.mobile;
            }
        } 
        else if (req.body.backgroundType === "Tracker") {
            if (req.body.backgroundDevice === "Desktop") {
                user.customization.backgrounds.tracker.desktop.main = req.files.tracker_desktop_main[0].path || user.customization.backgrounds.tracker.desktop.main;
                user.customization.backgrounds.tracker.desktop.pause = req.files.tracker_desktop_pause[0].path || user.customization.backgrounds.tracker.desktop.pause;
            }
            else if (req.body.backgroundDevice === "Mobile") {
                user.customization.backgrounds.tracker.mobile.main = req.files.tracker_mobile_main[0].path || user.customization.backgrounds.tracker.mobile.main;
                user.customization.backgrounds.tracker.mobile.pause = req.files.tracker_mobile_pause[0].path || user.customization.backgrounds.tracker.mobile.pause;
            }
        }
        else if (req.body.backgroundType === "Chat") {
            user.customization.chatAppearance.background = req.files.chat_background[0].path || user.customization.chatAppearance.background;
        }
        await user.save();
        res.status(201).json({message: 'Backgrounds updated successfully'});
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
}

exports.updateTheme = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: 'User not found'});
        user.customization.themeMode = req.body.themeMode || user.customization.themeMode;
        await user.save();
        res.status(201).json({message: 'Theme mode updated successfully'});
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
}

exports.updateTopbarTheme = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: 'User not found'});
        user.customization.topbarTheme.style = req.body.style || user.customization.topbarTheme.style;
        user.customization.topbarTheme.text = req.body.text || user.customization.topbarTheme.text;
        user.customization.topbarTheme.color = req.body.color || user.customization.topbarTheme.color;
        await user.save();
        res.status(201).json({message: 'Topbar theme updated successfully'});
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
}

exports.updateAiProfileAppearance = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: 'User not found'});
        user.aiProfileAppearance.avatarStyle = req.body.avatarStyle || user.aiProfileAppearance.avatarStyle;
        user.aiProfileAppearance.style = req.body.style || user.aiProfileAppearance.style;
        user.aiProfileAppearance.banner = req.files.aiBanner[0].path || user.aiProfileAppearance.banner;
        await user.save();
        res.status(201).json({message: 'AI Profile appearance updated successfully'});
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
}

exports.updateProfileAppearance = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: 'User not found'});
        if (req.body.avatarStyle) {
            user.profileAppearance.avatarStyle = req.body.avatarStyle;
        }
        if (req.body.theme) {
            user.profileAppearance.theme = req.body.theme;
        }
        if (req.files.banner) {
            user.profileAppearance.banner = req.files.banner[0].path || user.profileAppearance.banner;
        }
        if (req.body.description) {
            user.profileAppearance.description = req.body.description;
        }
        if (req.body.status) {
            user.profileAppearance.status = req.body.status;
        }
        if (req.body.socialLinks) {
            user.profileAppearance.socialLinks.linkedin = req.body.socialLinks.linkedin || user.profileAppearance.socialLinks.linkedin;
            user.profileAppearance.socialLinks.github = req.body.socialLinks.github || user.profileAppearance.socialLinks.github;
        }
        await user.save();
        res.status(201).json({message: 'Profile appearance updated successfully'});
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
}

exports.updateProfileTags = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({message: 'User not found'});
        user.profileAppearance.tags.push(req.body.tag);
        await user.save();
        res.status(201).json({message: 'Profile tags updated successfully'});
    } catch(err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
}