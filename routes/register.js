// 一、数据库与模板的引入
var express = require("express");
//建立一个路由空表！！！！
var router = express.Router();
//引入user 模型 类似于英雄联盟  只能有六神装的设计
const user = require("../sql/user");


// 二、页面的渲染

router.get("/", function (req, res, next) {
    console.log('此时进入了register')
      res.render("register");
    });





// 三、数据的传输

// 1.传输数据
    router.post("/in", function (req, res, next) {
        console.log("进入register的in 处理");
      
        let obj = req.body;
        console.log(obj)
        console.log(obj.adminName);
        console.log(obj.passWord);






// 1）普通设计：直接注册
        // user.insertMany(obj,(err,data)=>{
        //     if(err) {
        //         console.log(err)
        //     }
        //     console.log(data)

        //     if(data) {
        //         res.redirect('/login')
        //     }else {
        //         res.redirect('/register')
        //     }
        // })



// 问题一、当用户存在，却一直注册防止让其重复注册
// 问题二、安全设计：没认证过得不允许让其操作数据库内部数据
// 问题一：重复用户的解决问题
//安全设计：当用户存在，却一直注册防止让其重复注册
    // 、解决用户重复的第二种写法
// 逻辑思路
// 在数据库里面找有没有已经注册过
// 1、数据不合适 报错
// 2、数据合适   a、 有这个数据j就不让其注册，回到注册页面继续填写
             // b、没有这个数据就从数据库里面插入数据  /2-b-1   有错
//                                                  //2-b-2 没错:注册成功，跳到登录界面

 user.findOne({ adminName: obj.adminName }, (err, data) => {
   //1、数据不合适
   if (err) {
     console.log(err);
   }
   //2、数据合适：拿到合适的数据判断此数据是否存在数据库
   if (data) {
     //2-a、存在：有这个数据就不让其注册，回到注册页面继续填写
     res.redirect("/register");
   } // 2-b、不存在：不存在就插入数据
   else {
     user.insertMany(obj, (err, data) => {
       //2-b-1   有错
       if (err) {
         console.log(err);
       }
       //2-b-2 没错:注册成功，跳到登录界面
    //    console.log(data);
       res.redirect('/login')
     });
   }
 });


// /第三种写法
//   user.findOne({adminName:obj.adminName}, (err, data) => {
//     if (err) {
//       console.log(err);
//     }
//     if (data) {
//       res.redirect("/register");
//     } else {
//       user.insertMany(obj, (err, data) => {
//         if (err) {
//           console.log(err);
//         }
//         console.log(data);

//         if (data) {
//           res.redirect("/login");
//         } else {
//           res.redirect("/register");
//         }
//       });
//     }
//   });

      });


// 四、模块导出
module.exports = router;