const passport = require("passport");

module.exports = router => {
  router.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );

  router.get("/logout", (req, res) => {
    req.logout();
    req.session = null;
    res.render("login");
  });

  router.get("/login", (req, res) => {
    res.render("login");
  });

  router.get(
    "/home",
    passport.authenticate("google"),
    (req, res) => {
      if (req.user) {
        res.redirect("/");
      } else {
        res.redirect("/login");
      }
    },
    (req, res) => {
      res.send("Hy Faheem");
    }
  );

  router.get(
    "/github",
    passport.authenticate("github", {
      scope: ["email", "public_profile"]
    })
  );

  router.get(
    "/auth/github/callback",
    passport.authenticate("github"),
    (req, res) => {
      if (req.user) {
        res.redirect("/");
      } else {
        res.redirect("/login");
      }
    },
    (req, res) => {
      res.send("Hy Faheem");
    }
  );
};
