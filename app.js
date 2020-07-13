const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
	title: {
		type: String,
		required: true
	},
	content: String
}
const Article = mongoose.model("Article", articleSchema);

//--------------------------------Requests Targeting All Articles---------------------------------------------

app.route("/articles")
.get(function(req, res) {
	Article.find({}, function(err, foundArticles) {
		if(!err) {
			res.send(foundArticles);
		} else {
			res.send(err);
		}
	});
})
.post(function(req,res) {
	const newArticle = new Article({
		title: req.body.title,
		content: req.body.content
	});
	newArticle.save(function(err) {
		if(!err) {
			res.send("Successfully added items.");
		} else{
			res.send(err);
		}
	});
})
.delete(function(req,res) {
	Article.deleteMany({}, function(err) {
		if(!err) {
			res.send("Successfully deleted all the articles.");
		} else {
			res.send(err);
		}
	});
});

//--------------------------------Requests Targeting A Specific Article---------------------------------------------

app.route("/articles/:articleTitle")
.get(function(req,res) {
	Article.findOne({title: req.params.articleTitle}, function(err,foundArticle) {
		if(!err) {
			if(foundArticle) {
				res.send(foundArticle);
			} else {
				res.send("No articles matching with title is found.");
			}
		} else {
			res.send(err);
		}
	})
})
.put(function(req,res) {
	Article.update(
		{title: req.params.articleTitle},
		{title: req.body.title, content: req.body.content},
		{overwrite: true},
		function(err) {
			if(!err) {
				res.send("Successfully updated the article.");
			} else{
				res.send(err);
			}
		}
	);
})
.patch(function(req,res) {
	Article.update(
		{title: req.params.articleTitle},
		{$set: req.body},
		function(err) {
			if(!err) {
				res.send("Successfully updated the article.");
			} else {
				res.send(err);
			}
		}
	);
})
.delete(function(req,res) {
	Article.deleteOne({title: req.params.articleTitle}, function(err) {
		if(!err) {
			res.send("Successfully deleted the article from database.");
		} else {
			res.send(err);
		}
	});
});


app.listen(process.env.PORT || 3000, function() {
	console.log("Server is running at port 3000");
})

