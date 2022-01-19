const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-lissa:lissalove2000@cluster0.hqrux.mongodb.net/todolistdb");

const itemsSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
    name : "Welcome to our TODOLIST!!!"
});

const item2 = new Item ({
    name : "Hit + to add a new item."
});

const item3 = new Item ({
    name : " Hit the checkbox to delete an item."
})

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);



app.get("/", function(req,res) {
     
    Item.find({}, function(err,foundItems){
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems,function(err){
                if(err) {
                    console.log(err);
                } else {
                    console.log("Successfully saved default items to db");
                }
            })
        } else {
            res.render('list', {listTitle: "Today", newListItems: foundItems});
        }
        
    })
    
});

app.get("/:customListName", function(req,res){
    const customListName = req.params.customListName;

    List.findOne({name: customListName}, function(err, foundList){
        if (!err){
            if(!foundList) {
                if (customListName === "contact"){
                    res.render("contact");
                } else {
                    //create new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                 list.save()
                 res.redirect("/"+ customListName)
            
                console.log("Doesnt exist");
                }
                
            } else {
                //show existing list
                res.render("list", {listTitle: _.upperCase(foundList.name), newListItems: foundList.items});
        }
    }
    });

   
   
    // const requestedTitle = _.lowerCase(req.params.customListName); 
    
    // Item.find({}, function(err,foundItems){
    //     if (foundItems.length === 0) {
    //         Item.insertMany(defaultItems,function(err){
    //             if(err) {
    //                 console.log(err);
    //             } else {
    //                 console.log("Successfully saved default items to db");
    //             }
    //         })
    //     } else {
    //         res.render("list", {listTitle: _.upperCase(requestedTitle), newListItems: foundItems});
    //     }
        
    // })
    
  })

app.post("/", function(req,res){

   const itemName = req.body.newItem;
   const listName = req.body.list; //.slice(0,-1); //for removing an extra space

   const item = new Item({
       name: itemName
   });

   if (listName === "Today"){
    item.save();
     res.redirect("/");
   } else {
    List.findOne({name: listName}, function(err, foundList){
        foundList.list.push(item);
        foundList.save();
       // console.log(foundList.list);
        res.redirect("/" + listName);
    })
   }
});

app.post("/delete", function(req,res){
   const checkedItemId = req.body.checkbox;

   Item.deleteOne({_id:checkedItemId}, function(err){
       if(err){
           console.log(err);
       } else {
           console.log("success");
           res.redirect("/")
       }
   })
})

app.get("/contact", function(req,res){
    
    res.render('contact');
})

app.post("/contact", function(req,res){
    res.sendFile(__dirname + "/contact.ejs");
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 5000;
}

app.listen(port, function() {
    console.log("Server has started successfully.");
});