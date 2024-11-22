
// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
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


//var MONGOURI = "mongodb://heroku_8b2lj84v:ua9jmsq0ggs9ofj2r0r7q3gdc6@ds133776.mlab.com:33776/heroku_8b2lj84v";
console.log("hello mongo");
console.log(process.env.MONGODB_URI);
var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongoadmin:casper34@db:27017/admin'; 



//todo change this later to MONGODB_URI for heroku
/*var promise = mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

mongoose.Promise = global.Promise;

var db= null;
promise.then(function(database){
   console.log("got mongodb instance")
   db = database;
});

*/
var Schema = mongoose.Schema;

var technewSchema = new Schema({

  _id:{type:Schema.Types.ObjectId},
  url :{
    type:String,
    unique:true},
  imageUrl:String,
  title: {
    type:String,
    unique:true
  },
  info:String,
  authorlink:String,
  authorName:String,
  comments:[{type:Schema.Types.ObjectId,ref:"Comment"}]
});


var commentSchema = new Schema({
  techinfo:{type:Schema.Types.ObjectId, ref:"Techinfo"},
  body:{type:String,unique:true}
});



var Techinfo = mongoose.model('Techinfo', technewSchema);
var Comment = mongoose.model('Comment',commentSchema);



// Routes

function getNewsfromdb(res,scrapeUrl){
  Techinfo.find({},function(err,techinfo){
    if(err){
      console.log(err + "error in getting news from db");
    }
    else{
      //console.log(techinfo);
      if(techinfo !== undefined && techinfo.length >= 1 ){
        console.log("render the saved news");
        console.log(techinfo);
        res.render("saved",{newsitems:techinfo});
      }
      else{
        //scrapeNews(scrapeUrl,res);
        console.log("no saved technews");
        res.render("saved",{newsitems:techinfo});
      }
    }

  });
  return false;
}



function scrapeNews(url,res){
  console.log("scrape news")
  request(url, function(error, response, html) {

  var $ = cheerio.load(html);
  //console.log($.html());
  var newsitems = [];
  console.log("parse techcrunch html");
  
  $(".wp-block-post").each(function(i, element) {
    
    console.log("process news item");
    var newsOb = {};

    var url = $(element).find(".loop-card__title").find("a").attr("data-destinationlink");
    if(url !== undefined){
      newsOb.url = url;
    }
    
    console.log(url);
    var imgLink = $(element).find(".loop-card__figure").find("img").attr("src");
    console.log(imgLink)
    if(imgLink !== undefined){
      newsOb.imageUrl = imgLink.slice(0,imgLink.lastIndexOf("?"));
    }
    else{
      newsOb.imageUrl = "https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg";
    }

    newsOb.title = $(element).find(".loop-card__cat").text();
    var info = $(element).find(".loop-card__title").find("a").text();
    if(info !== undefined){
      newsOb.info = info;
    }
    else{
      newsOb.info = "To be shared later...Currently not much info on this is available";
    }

    newsOb.postedTime = $(element).find("time").attr("datetime");
    newsOb.authorlink = "www.techcrunch.com" + $(element).find(".loop-card__author-list").find("a").attr("href");
    newsOb.authorName = $(element).find(".loop-card__author-list").find("a").text();
    console.log(newsOb);
    //newsitems.push(newsOb);
    var techinfo = new Techinfo({
      _id:new mongoose.Types.ObjectId(),
      url:newsOb.url,
      imageUrl:newsOb.imageUrl,
      title:newsOb.title,
      info:newsOb.info,
      postedTime:newsOb.postedTime,
      authorlink:newsOb.authorlink,
      authorName:newsOb.authorName
    });

    newsOb._id = techinfo._id;
    newsOb.id = i;
    newsitems.push(newsOb);
    
   /* 
    techinfo.save(function(err){
      if(err) {
        console.log(err + "  technews saving failed");
        //return handleError(err);
      }
      else{
        console.log("technews saving completed");
      }
    }); */

  });

  console.log(newsitems);
  res.render("index",{newsitems:newsitems});

});

}




app.get("/", function(req, res) {
  var scrapeUrl="https://techcrunch.com/";
  scrapeNews(scrapeUrl,res)
});



app.get("/saved", function(req, res) {

  getNewsfromdb(res,null);

});



app.get("/gadgets", function(req, res) {
  var scrapeUrl="https://techcrunch.com/gadgets/";
  scrapeNews(scrapeUrl,res)
});



app.get("/social", function(req, res) {
  var scrapeUrl="https://techcrunch.com/social/";
  scrapeNews(scrapeUrl,res)
});



app.get("/enterprise", function(req, res) {
  var scrapeUrl="https://techcrunch.com/enterprise/";
  scrapeNews(scrapeUrl,res)
});



app.post("/api/technews",function(req,res){
   console.log(req.body);
   var techinfo = new Techinfo({
      _id:new mongoose.Types.ObjectId(),
      url:req.body.url,
      imageUrl:req.body.imageUrl,
      title:req.body.title,
      info:req.body.info,
      postedTime:req.body.postedTime,
      authorlink:req.body.authorlink,
      authorName:req.body.authorName
    });

   techinfo.save(function(err){
      if(err) {
        console.log(err + "  technews saving failed");
        //return handleError(err);
      }
      else{
        console.log("technews saving completed");
        res.json(techinfo);
      }
    });

});



app.get("/api/comments/:techinfoid",function(req,res){
  console.log(req.params.techinfoid);
  Comment.find({techinfo:req.params.techinfoid},function(err,docs){
    if(err){
      console.log(err + " failed to get the comments");
      res.send("cant get comments");
    }
    else {
       console.log("got all the comments");
       res.json(docs); 
    }
  });

});




app.delete("/api/news/:techinfoid",function(req,res){

  Techinfo.deleteOne({_id:req.params.techinfoid},function(err){
    if(err){
      console.log("delete technews failed");
      res.send("delete news failed");
    }
    else{
      console.log("delete completed");
      Comment.deleteMany({techinfo:mongoose.Types.ObjectId(req.params.techinfoid)},function(err){
        if(err){
          console.log("comments delete for news failed");
          res.send("comments delete for news failed");
        }
        else{
          console.log("comments delete for news done");
          res.json({"message":"completed"});
        }
      });
    }

  });

});




app.post("/api/comments",function(req,res){
  var comment = new Comment({
    body:req.body.comments,
    techinfo:req.body.techinfoid
  });
  comment.save(function(err){
    if(err){
      console.log(err + " comments save failed");
      res.send("comments save failed");
    }
    else{
      console.log("comments saved successfully");
      res.json(comment);
   }

  });

});




app.delete("/api/comments",function(req,req){
   console.log("delete comment");
   console.log(req.body.commentid);

});




// Set the app to listen on port 3000
app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});
