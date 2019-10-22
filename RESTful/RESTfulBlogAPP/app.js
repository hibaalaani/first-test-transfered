var express=require ("express"),
	methodOverride=require("method-override"),
	expressSanitizer=require("express-sanitizer"),
		 app=express(),
		mongoose=require("mongoose"), 
		bodyParser=require("body-parser");

	mongoose.connect("mongodb://localhost:27017/rest_ful_app", { useNewUrlParser: true,useUnifiedTopology: true,
	useCreateIndex: true});
		app.set("view engine","ejs");
		app.use(bodyParser.urlencoded({extended: true}));
		app.use(express.static("public"))
		app.use(methodOverride("_method"));
		app.use(expressSanitizer());
//schema set  up

var blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);

//blog route
app.get("/",function(req,res){
	res.redirect("/blogs");
})
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("error");
		}else{
			res.render("index",{blogs:blogs})
		}
	})
})

// app.get("/blogs", function(req, res){
//     Blog.find({}).sort({"_id": -1}).exec(function(err, blogs) {
//         if(err){
//             console.log(err);
//         } else {
//            res.render("index", {blogs: blogs}); 
//         }
//     });
// }); 
app.get("/blogs/new",function(req,res){
	res.render("new");
})
//CREATE ROUTE
app.post("/blogs",function(req,res){
	console.log(req.body);
	req.body.blog.body=req.sanitize(req.body.blog.body)
	console.log(req.body);
	//create blog
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render("new")
		}else{
			//redirect to blogs
			res.redirect("/blogs")
		}
			
	});
	
});
//show route
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog: foundBlog})
		}
	})
});
//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs")
		}else{
			res.render("edit",{blog:foundBlog})
		}
			
	})
	
})
/// UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
		req.body.blog.body=req.sanitize(req.body.blog.body)
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
		if(err){
			res.redirect("/blogs")
		}else{
			res.redirect("/blogs/" + req.params.id)
		}
	})
})
//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
	//destroy blog
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs")
		}else{
			res.redirect("/blogs")
		}
	})
})


app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log("Server of Blogs is started");
})