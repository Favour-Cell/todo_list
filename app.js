const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")

console.log(date)

const app = express();

var newItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req,res) {
    let day = date.getDate();

    res.render('list', {listTitle: day, newListItems: newItems});
});

app.post("/", function(req,res){
    console.log(req.body);
   var newItem = req.body.newItem;

   newItems.push(newItem)
    res.redirect("/")
});

app.get("/contact", function(req,res){
    
    res.render('contact');
})

app.post("/contact", function(req,res){
    res.sendFile(__dirname + "/contact.ejs");
})

app.listen(process.env.PORT || 5000, function() {
    console.log("Server is running on port 5000.");
});