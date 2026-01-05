const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
    name: String,
    description: String,
    dateEarned: {type: Date, default: Date.now}
});

const profileAppearanceSchema = new mongoose.Schema({
    avatarStyle: {type: String, default: 'default'},
    theme: {type:String, default: 'default'},
    tags: [{
        tagId: {type: mongoose.Schema.Types.ObjectId, ref: 'Tag'},
        acquiredAt: {type: Date, default: Date.now},
        active: {type: Boolean, default: true}
    }],
    banner: {type:String, default: 'default_banner.jpg'},
    description: {type:String, default: ''},
    status: {type:String, default: ''},
    socialLinks: {
        linkedin: {type: String, default: ''},
        github: {type: String, default: ''}
    }
});

const aiProfileAppearanceSchema = new mongoose.Schema({
    avatarStyle: {type: String, default: 'default_ai'},
    style: {type: String, default: 'default'},
    banner: {type: String, default: 'default_ai_banner.jpg'}
});

const customizationSchema = new mongoose.Schema({
    themeMode: {type: String, enum: ['light', 'dark', 'auto'], default: 'auto'},
    colorPalette: {
        light: {
            primary: {type: String, default: '#4F46E5'},
            secondary: {type: String, default: '#06B6D4'},
            background: {type: String, default: '#FFFFFF'},
            text: {type: String, default: '#000000'}
        },
        dark: {
            primary: {type: String, default: '#6366F1'},
            secondary: {type: String, default: '#22D3EE'},
            background: {type: String, default: '#0F172A'},
            text: {type: String, default: '#FFFFFF'}
        }
    },
    backgrounds: {
        desktop: {type: String, default: 'default.jpg'},
        mobile: {type: String, default: 'default_mobile.jpg'}
    },
    trackerBackgrounds: {
        desktop: {
            main: {type: String, default: 'tracker_main.jpg'},
            pause: {type: String, default: 'tracker_pause.jpg'}
        },
        mobile: {
            main: {type: String, default: 'tracker_main_mobile.jpg'},
            pause: {type: String, default: 'tracker_pause_mobile.jpg'}
        }
    },
    chatAppearance: {
        bubbleStyle: {type: String, enum: ['rounded', 'sharp'], default: 'rounded'},
        bubbleColor: {type: String, default: '#F1F1F1'},
        textColor: {type: String, default: '#000000'},
        background: {type: String, default: 'default_chat.jpg'}
    },
    preferences: {
        notifications: {type: Boolean, default: true},
        sound: {type:Boolean, default: true},
        language: {type: String, default: 'en'}
    },
    topbarTheme: {
        style: {type: String, default: "default"},
        text: {type: String, default: '#FFFFFF'},
        color: {type: String, default: '#4379deff'}
    }
});

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    displayName: { type: String, default: '' },
    googleId: { type: String },
    githubId: { type: String },
    password: {
        type: String,
        required: function () {
            return !this.googleId && !this.githubId;
        }
    },
    // Optional: local auth should require only username/password.
    // NOTE: if your MongoDB already has a non-sparse unique index on `email`,
    // you'll need to drop/recreate it as sparse/partial to allow multiple users without email.
    email: { type: String, unique: true, sparse: true },
    isVerified: { type: Boolean, default: true },
    emailVerificationToken: { type: String },
    emailVerificationExpires: {type: Date},
    resetPasswordToken: { type: String },
    resetPasswordExpire: {type: Date},
    refreshTokens: [String],
    sessionIds: [{ id: String, token: String }],
    coins: {type: Number, default: 0},
    friends: {type: Array, default: []},
    // Keep field for backward compatibility, but don't require it for auth.
    isCompleted: {type: Boolean, default: true},
    friendRequests: {type: Array, default: []},
    profileAppearance: profileAppearanceSchema,
    aiProfileAppearance: aiProfileAppearanceSchema,
    profilePicture: { type: String, default: 'default.jpg' },
    profileDescription: { type: String, default: '' },
    aiName: { type: String, default: 'AI Assistant' },
    aiProfilePicture: { type: String, default: 'default.jpg' },
    aiPersonality: { type: String, default: '' },
    aiDescription: { type: String, default: '' },
    subscription: { type: String, default: 'free' },
    habits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Habit' }],
    chatHistories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatHistory' }],
    achievements: [achievementSchema],
    memories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Memory'}],
    customization: { type: customizationSchema, default: () => ({}) },
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],
    trackers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tracker'}],
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
    plans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plan' }],
    milestones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' }],
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    createdAt: { type: Date, default: Date.now },
    lastSeenOnline: { type: Date, default: Date.now }
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);