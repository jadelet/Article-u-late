// var handlebars = require("handlebars");
var logger = require("morgan");
var express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

var PORT = 3000;
var MONGODB_URI = process.env.MONGODB_URI || ("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });


mongoose.connect(MONGODB_URI);
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
var dbUrl = "snopesScraper";
var collections = ["snopesStuff"];

var db = mongojs(dbUrl, collections);
db.on("error", function (error) {
  console.log("Database Error:", error);
});

// Main page route
app.get("/", function (req, res) {
  // put handlebars? for main page here.
  return ("please let this work")
});


app.get("/all", function (req, res) {
  db.snopesStuff.find({})
    .then(function (dbsnopesStuff) {

      res.json(dbsnopesStuff);
    })
    .catch(function (err) {

      res.json(err);
    });
});

app.get("/snopesStuffs/:id", function (req, res) {
  db.snopesStuff.findOne({ _id: req.params.id })
    .populate("Comment")
    .then(function (dbsnopesStuff) {

      res.json(dbsnopesStuff);
    })
    .catch(function (err) {

      res.json(err);
    });
  if (error) {
    console.log(error);
  }
  else {
    res.json(found);
  }
});



app.get("/scrape", function (req, res) {
  axios.get("https://snopes.com").then(function (response) {
    var $ = cheerio.load(response.data);
    $(".list-group-item").each(function (i, element) {
      var title = $(element).children("a").text();
      var link = $(element).children("a").attr("href");


      db.snopesStuff.insert({
        title: title,
        link: link
      },
        function (err, inserted) {
          if (err) {
            console.log(err);
          }
          else {

            console.log(inserted);
          }
        });
    });
  });

  res.send("Scrape Complete");
});

app.post("/snopesStuffs/:id", function (req, res) {

  db.Comment.create(req.body)
    .then(function (dbComment) {

      return db.snopesStuff.findOneAndUpdate({ _id: req.params.id }, { Comment: dbComment._id }, { new: true });
    })
    .then(function (dbsnopesStuff) {
      res.json(dbsnopesStuff);
    })
    .catch(function (err) {

      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
