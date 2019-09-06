const express = require("express");
const app = express();

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/todo", { useNewUrlParser: true });

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

app.listen(3000, () => {
  console.log("app is running!");
});
