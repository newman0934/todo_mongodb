const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport")
const bcrypt = require("bcryptjs")


//登入頁面
router.get("/login", (req, res) => {
  res.render("login");
});

//登入功能
router.post("/login", (req, res,next) => {
    passport.authenticate("local",{
        successRedirect: "/",
        failureRedirect:"/users/login"
    })(req,res,next)
});

//註冊頁面
router.get("/register", (req, res) => {
  res.render("register");
});

//註冊功能
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  User.findOne({ email: email }).then(user => {
    if (user) {
      // 檢查 email 是否存在
      console.log("User already exists");
      res.render("register", {name,email,password,password2});

    } else {

      const newUser = new User({
        // 如果 email 不存在就直接新增
        name:name,
        email:email,
        password:password
      });
      bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
          if(err) throw err
          newUser.password = hash

          newUser.save()
          .then(user => {
            res.redirect("/"); // 新增完成導回首頁
          })
          .catch(err => console.log(err));

        })
      })
    }
  });
});

router.get("/logout", (req, res) => {
  req.logOut()
  res.redirect("/users/login")
});

module.exports = router;
