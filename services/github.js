const passport = require("passport");
const mongoose = require("mongoose");
const GitHubStrategy = require("passport-github").Strategy;
const Users = mongoose.model("users");

passport.serializeUser(async (user, done) => {
  await done(null, user._id);
});

passport.deserializeUser((id, done) => {
  Users.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GitHubStrategy(
    {
      clientID: "96c41aff5826a49aa743",
      clientSecret: "76664fc236862897f62acfa8fde5f7ea9bbf3b83",
      callbackURL: "https://faheemmovie.herokuapp.com/auth/github/callback"
    },
    async (Token, refreshToken, Profile, done) => {
      const user = await JSON.parse(Profile._raw);
      const gainUser = await Users.findOne({ githubId: user.node_id });
      if (gainUser) {
        done(null, gainUser);
      } else {
        new Users({
          githubId: gainUser.node_id,
          image: gainUser.avatar_url,
          name: gainUser.login
        })
          .save()
          .then(gainUser => done(null, gainUser));
      }
    }
  )
);
