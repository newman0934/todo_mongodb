const express = require("express")
const app = express()

const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost/todo",{useNewUrlParser:true})

const Todo = require("./models/todo")

const db = mongoose.connection

db.on("error",()=>{
	console.log("mongodb error")
})

db.once("open",()=>{
	console.log("mongodb connected")
})

app.get('/', (req, res) => {
	res.send('hello world!')
  })
  
app.listen(3000, () => {
	console.log('App is running!')
})