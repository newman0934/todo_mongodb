const express = require("express");
const app = express();

if(process.env.NODE_ENV !== "production"){
  require("dotenv").config()
}


//載入session
const session = require("express-session")
app.use(session({
  secret: 'your secret key',   // secret: 定義一組屬於你的字串做為私鑰
  resave: false,
  saveUninitialized: true,
}))

//載入passport
const passport = require("passport")
app.use(passport.initialize())
app.use(passport.session())

require("./config/passport")(passport)

app.use((req,res,next)=>{
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
})

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const flash = require("connect-flash")

app.use(flash())

app.use((req,res,next)=>{
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.success_msg = req.flash("success_msg")
  res.locals.warning_msg = req.flash("warning_msg")
  next()
})

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/todo", { useNewUrlParser: true,useCreateIndex:true });

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const Todo = require("./models/todo");

const db = mongoose.connection;

db.on("error", () => {
  console.log("mongodb error");
});

db.once("open", () => {
  console.log("mongodb connected");
});

const methodOverride = require("method-override")
app.use(methodOverride("_method"))


app.use("/",require("./routes/home"))
app.use("/todos",require("./routes/todos"))
app.use("/users",require("./routes/user"))
app.use("/auth",require("./routes/auths"))

app.listen(3000, () => {
  console.log("app is running!");
});
