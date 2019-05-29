const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");

const Users = mongoose.model("users");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log(id);
  Users.findById(id).then(user => done(null, user));
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "395041283121-s1ui18ljfak2d3eqbrilejl77hgiq5pm.apps.googleusercontent.com",
      clientSecret: "86CrkkurIxSO7Aw11ZWsBAoS",
      callbackURL: "https://faheemmovie.herokuapp.com/home"
    },
    (accessToken, refreshToken, profile, done) => {
      Users.findOne({ googleId: profile.id }).then(alreadyUser => {
        if (alreadyUser) {
          done(null, alreadyUser);
        } else {
          new Users({
            googleId: profile.id,
            image: profile.photos[0].value,
            name: profile.name.givenName
          })
            .save()
            .then(user => {
              done(null, user);
            });
        }
      });
    }
  )
);
