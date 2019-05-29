var express = require("express");
var router = express.Router();
const request = require("request");

//api links
const apiKey = "1fb720b97cc13e580c2c35e1138f90f8";
const apiBaseUrl = "http://api.themoviedb.org/3";
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = "http://image.tmdb.org/t/p/w300";

// routes

router.use((req, res, next) => {
  res.locals.imageBaseUrl = imageBaseUrl;
  next();
});

function isLoggedIn(req, res, next) {
  console.log(req.session);
  if (req.user !== undefined) {
    next();
  } else {
    res.redirect("/login");
    res.render("login");
  }
}

router.get("/", isLoggedIn, function(req, res, next) {
  request.get(nowPlayingUrl, (err, response, data) => {
    const parseData = JSON.parse(data);
    if (req.user) {
      res.render("index", {
        parseData: parseData.results,
        user: req.user
      });
    } else {
      res.render("login");
    }
  });
});

router.get("/movie/:id", isLoggedIn, (req, res, next) => {
  const movieID = req.params.id;
  const thisMovieUrl = `${apiBaseUrl}/movie/${movieID}?api_key=${apiKey}`;

  request.get(thisMovieUrl, (err, response, data) => {
    const parseData = JSON.parse(data);
    res.render("single-movie", { parseData, user: req.user });
  });
});

router.post("/search", isLoggedIn, (req, res, next) => {
  console.log(req.user);
  const querySearchTerm = encodeURI(req.body.movieSearch);
  const cat = req.body.cat;
  const movieURL = `${apiBaseUrl}/search/${cat}?query=${querySearchTerm}&api_key=${apiKey}`;

  request.get(movieURL, (err, response, data) => {
    const parseData = JSON.parse(data);
    if (cat === "person") {
      parseData.results = parseData.results[0].known_for;
    }
    res.render("index", {
      parseData: parseData.results,
      user: req.user
    });
  });
});
require("./authRoutes")(router);

module.exports = router;
