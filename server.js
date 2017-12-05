
// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));



var databaseUrl = "tech";
var collections = ["technews"];


var db = mongojs(databaseUrl, collections);


db.on("error", function(error) {
  console.log("Database Error:", error);
});


db.on("connect",function(){
  console.log("connected to db");
});


// Routes

function scrapeNews(url,res){
  request(url, function(error, response, html) {

  var $ = cheerio.load(html);
  var newsitems = [];

  
  $("li.river-block").each(function(i, element) {

    var newsOb = {};
    var url = $(element).attr("data-permalink");
    if(url !== undefined){
      newsOb.url = url;
    }
    
    var imgLink = $(element).find("a.thumb").find("img").attr("data-src");
    if(imgLink !== undefined){
      newsOb.imageUrl = imgLink.slice(0,imgLink.lastIndexOf("?"));
    }
    else{
      newsOb.imageUrl = "https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg";
    }

    newsOb.title = $(element).find("h2.post-title").find("a").text();
    var info = $(element).find("p.excerpt").text();
    if(info !== undefined){
      newsOb.info = info;
    }
    else{
      newsOb.info = "To be shared later...Currently not much info on this is available";
    }

    newsOb.postedTime = $(element).find("time").attr("datetime");
    newsOb.authorlink = "www.techcrunch.com" + $(element).find("div.byline").find("a").attr("href");
    newsOb.authorName = $(element).find("div.byline").find("a").text();
    
    newsitems.push(newsOb);
    db.technews.find({title:newsOb.title},function(error,data){
      if(data == undefined || data.length == 0){
        db.technews.insert(newsOb);
      }
    });

  });

  console.log(newsitems);
  res.render("index",{newsitems:newsitems});

});

}



app.get("/", function(req, res) {
  var scrapeUrl = "https://techcrunch.com/mobile/";
  scrapeNews(scrapeUrl,res);
});



app.get("/scrape", function(req, res) {
  var scrapeUrl="https://techcrunch.com/";
  scrapeNews(scrapeUrl,res)
});





// Set the app to listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
