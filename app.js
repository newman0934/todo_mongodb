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

app.get("/", (req, res) => {
  Todo.find((err, todos) => {
    if (err) return console.error(err);
    return res.render("index", { todos: todos });
  });
});
// 列出全部 Todo
app.get("/todos", (req, res) => {
  return res.redirect("/");
});
// 新增一筆 Todo 頁面
app.get("/todos/new", (req, res) => {
  res.render("new");
});
// 顯示一筆 Todo 的詳細內容
app.get("/todos/:id", (req, res) => {
    Todo.findById(req.params.id, (err, todo) => {
		if (err) return console.error(err)
		return res.render('detail', { todo: todo })
	})
});
// 新增一筆  Todo
app.post("/todos", (req, res) => {
  const todo = new Todo({
    name: req.body.name
  });
  todo.save(err => {
    if (err) return console.error(err);
    return res.redirect("/");
  });
});
// 修改 Todo 頁面
app.get("/todos/:id/edit", (req, res) => {
  Todo.findById(req.params.id,(err,todo)=>{
	  if(err) return console.error(err)
	  return res.render("edit",{todo:todo})
  })
});
// 修改 Todo
app.post("/todos/:id/edit", (req, res) => {
  Todo.findById(req.params.id,(err,todo)=>{
	  if(err) return console.error(err)
	  todo.name = req.body.name
	  todo.save(err=>{
		  if(err) return console.error(err)
		  return res.redirect(`/todos/${req.params.id}`)
	  })
  })
});
// 刪除 Todo
app.post("/todos/:id/delete", (req, res) => {
  Todo.findById(req.params.id,(err,todo)=>{
	  if(err) return console.error(err)
	  todo.remove(err=>{
		  if(err) return console.error(err)
		  return res.redirect("/")
	  })
  })
});

app.listen(3000, () => {
  console.log("app is running!");
});
