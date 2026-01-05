const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("./models/User");
const jwt = require("jsonwebtoken");

passport.serializeUser((user,done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://api.aurocore.me/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id});
        if (!user) {
            user=new User({
                username: `google_${profile.id}`,
                email: profile.emails[0].value,
                googleId: profile.id,
                isVerified: true
            });
            await user.save();
        }
        done(null, user);
    } catch (error) {
        done(error);
    }
}));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://api.aurocore.me/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ githubId: profile.id });

        let email = profile.emails && profile.emails[0] ? profile.emails[0].value : `github_${profile.id}@aurocore.com`;
        if (!user) {
            user = new User({
                username: `github_${profile.id}`,
                email: email,
                githubId: profile.id,
                isVerified: true
            });
            await user.save();
        }
        done(null, user);
    } catch (error) {
        done(error);
    }
}));