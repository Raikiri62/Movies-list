const express = require("express");
const router = express.Router();
const path = require("path");

const lists = [];

router.post('/publish',(req,res,next) => {
    let list = req.body;
    list.time = Date.toString();
    console.log(list);
    lists.push(req.body);
    res.send("OK");
});

// router.use('/publicLists/generated',(req,res,next) => {
//     // res.render("publicLists.ejs", {listsArray: lists});
    
// });
router.get('/publicLists',(req,res,next) => {
    if (req.query.name != null &&  req.query.name.trim() != ""){
        let requestedList = null;
        for(const list of lists){
            if(list.username === req.query.name){
                requestedList = list;
                break;
            }
        }
        if(requestedList != null){
            console.log(requestedList);
            res.render("userList.ejs", {list: requestedList});
        }
        else{
            next();
        }
    }
    else {
        res.render("publicLists.ejs", {listsArray: lists});
    }
    
});



exports.router = router;
exports.lists = lists;