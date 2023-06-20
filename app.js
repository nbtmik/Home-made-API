const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB",{useNewUrlParser:true});


const articleSchema = ({
    title:String,
    content:String
});

const Article = mongoose.model("Article",articleSchema);

////////////////////////////////////////////////////////////////////Requesting targeting all articles/////////////////////////////////////////////////////////////////////////////////

app.route("/articles")
.get(function(req,res){
    Article.find()
    .then(function(foundArticles){
        res.send(foundArticles);
    });
    // .catch(function(err){
    //     console.log(err);
    // });
})

.post(function(req,res){

    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    });
    newArticle.save()
    .then(function(){
        console.log("successfully added new article");
    })
    .catch(function(err){
        console.log(err);
    });
})

.delete(function(req,res){
    Article.deleteMany()
    .then(function(){
        console.log("Successfully deleted articles");
    })
    .catch(function(err){
        console.log(err);
    });
});

// app.get("/articles",function(req,res){
//     Article.find()
//     .then(function(foundArticles){
//         res.send(foundArticles);
//     });
//     // .catch(function(err){
//     //     console.log(err);
//     // });
// });

// app.post("/articles",function(req,res){

//     const newArticle = new Article({
//         title:req.body.title,
//         content:req.body.content
//     });
//     newArticle.save()
//     .then(function(){
//         console.log("successfully added new article");
//     })
//     .catch(function(err){
//         console.log(err);
//     });
// });

// app.delete("/articles",function(req,res){
//     Article.deleteMany()
//     .then(function(){
//         console.log("Successfully deleted articles");
//     })
//     .catch(function(err){
//         console.log(err);
//     });
// });

////////////////////////////////////////////////////////////////////Requesting targeting specific articles/////////////////////////////////////////////////////////////////////////////////

app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle})
    .then(function(foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }else{
            res.send("No articles matching that title was found.");
        }
    });
})

.put(function(req,res){
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true}
    )
    .then(function(){
        console.log("Successfully Updated");
    })
    .catch(function(err){
        console.log(err);
    });
})

.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body})
        .then(function(){
            console.log("seccessfully updated one");
        })
        .catch(function(err){
            console.log(err);
        });
})

.delete(function(req,res){
    Article.deleteOne({title: req.params.articleTitle})
    .then(function () {
        console.log("Successfully deleted the selected item");
    })
    .catch(function(err){
        console.log(err);
    });
});

app.listen("3000",function(){
    console.log("Server started on port 3000");
});