var express = require("express");
var router = express.Router();
const user = require("../sql/user");
// const { log } = require("debug");



// 1、传输页面样式
router.get("/", function (req, res, next) {
  console.log("此时进入了login");
  res.render("login");
});




// 2.传输数据
router.post("/in", function (req, res, next) {
  console.log('进来login 路由了 /in了 ')
   console.log(req.body)
   let obj = req.body;
   user.findOne(obj,(err,data)=>{
       if(err){
           console.log(err)
       }
       if(data) {
           //response  服务器和你说 你的肚子里面 cookie那个位置 给我村上islogin = 0k
            // res.cookie('islogin','ok')
           //注意 这里是req 设置的 实在服务器端设置的 因为要先分裂成一个对象 给前端一个 后端藏一个  前端通过给的那一个加密的来找信息
          req.session.islogin = 'ok'
          console.log('我在login路由 /in')
          // console.log(req.session.islogin)
           res.redirect('/pro')
       }else {
           res.redirect('/register')
       }
   }) 
   
});


  // console.log(obj);
  // console.log(obj.adminName);
  // console.log(obj.passWord);
//   //这一步是查询里面有没有 用户输入的 adminName passWord 有就可以跳后面页面 没有不可以
  // user.findOne(obj, (err, data) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   if (data) {
  //     res.redirect("/pro");
  //   } else {
  //     res.redirect("/register");
  //   }
  // });
// });




module.exports = router;
