const express = require("express");

const bodyParser = require("body-parser");
const path = require("path");



const app = express();



console.log("starting node runtime yeah!");



app.set("view engine","ejs");
app.set("views","views");



// app.use(bodyParser.urlencoded({
//     extended: false
// }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"public")));


const publishRouter = require("./routes/publish");


app.use(publishRouter.router);



app.get('/about',(req,res,next) => {
    // res.sendFile(path.join(__dirname,"../","views","index.html"));
    res.sendFile(path.join(__dirname,"views","about.html"));
});


app.get('/',(req,res,next) => {
    // res.sendFile(path.join(__dirname,"../","views","index.html"));
    res.sendFile(path.join(__dirname,"views","index.html"));
});

app.use((req,res,next) => {
    //res.status(404).send("<h1>page not found</h1>");
    res.status(404).sendFile(path.join(__dirname,"views","404.html"));
});

app.listen(process.env.PORT || 3002);