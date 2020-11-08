//一、 模块的创建和引入
var createError = require('http-errors');
var express = require('express');
var cookieParser = require("cookie-parser");
var session = require("express-session");
var path = require('path');
var logger = require('morgan');











  // 二、路由表的引入
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var proRouter = require('./routes/pro');
var userRouter = require('./routes/user');
var orderRouter = require('./routes/order');
var cartRouter = require('./routes/cart');
var loginRouter=require('./routes/login')
var registerRouter=require('./routes/register')

var app = express();







// 三、验证
// 当有用户登录时，给他中个cookie(门票)，进入内核网页时，让这个门卫进行验证，带cookie的这个数据通过验证，才可以进入
//1、守卫:为了防止非法用户修改网页内部数据，需要实名认证，没有实名认证就不让他进入，就需要设计一个守卫大神，来确保用户是合法的
// cookie---->session(加密的cookie))---->token
 //cookie路由守卫

//  逻辑架构
//  1引用路由
// 2、进行验证




.0// 1、有关cookie的
//0 中间件，内部有next
// app.use(cookieParser());
//cookie路由守卫
// app.all('*',(req,res,next)=>{
//   console.log('进入全局路由守卫')
//   console.log(req.cookies)
//   // 第一个选项 如果我给你了islogin = ok cookie 你可以直接跳
//   //第一步 是针对合法用户的   第二三部分 是针对 非法用户的放行条件  让他走正门！！！！
//   // if第一步 req.cookies.islogin === 'ok'是针对于 合法用户  直接放行  req.url === '/login'  req.url ==='/login/in'是针对友善的非法用户去登录页面 
//   if(req.cookies.islogin === 'ok' || req.url === '/login' || req.url ==='/login/in') {
//     console.log('next之前')
//     next()
//   }else {
//     //想不登录就访问其他页面的用户比如/pro 直接让他强制跳转  /login
//     //我们强制让非法用户跳转/login
//     console.log('cookie守卫路由else里面')
//     res.redirect('/login')
//   }
// })




// session 路由守卫
app.use(
  session({
    //session 加密信息
    secret: "gfgfg",
    //强制保存 官方建议false
    resave: false,
    //初始化session 存储 true
    saveUninitialized: true,
    
    //设置过期时间
    cookie: { maxAge: 1000 * 10*60 },
  })
);
app.all("*", (req, res, next) => {
  console.log("进入全局路由守卫");
  //这一步秘问前端那个秘闻 已经找到  藏在服务器的session是什么了 req.session.islogin = 'ok'
  console.log(req.session);
  if (
    req.session.islogin === "ok" ||
    req.url === "/login" ||
    req.url === "/login/in"
  ) {
    console.log("next之前");
    next();
  } else {
    console.log("守卫路由else");
     res.redirect("/login");
  }
});




// 三、1、连接view这个文件，也就是连接里面的ejs静态页面
// path.join(__dirname app.js的根目录到views这个文件
app.set('views', path.join(__dirname, 'views'));
console.log(path.join(__dirname))

//     2、使用模板 引擎ejs（通过引擎ejs才可以在expresss进行路由，进行数据传输）var app = express();
app.set('view engine', 'ejs');





// 四、dev的时候会处理logger日志
app.use(logger('dev'));




//五、 使用express的json模块 可以接收和处理现在最常用方便的JSON数据 脚手架已经配好
app.use(express.json());


//六、xtended: false：表示使用系统模块querystring来处理，也是官方推荐的  
app.use(express.urlencoded({ extended: false }));



// 七、当请求静态资源时，通过此目录,通向public（css和图片）中，使用里面的属性
app.use(express.static(path.join(__dirname, 'public')));





// 八、路由表的使用
// ****router.use*****（[路径]，[功能，...]功能）
// 使用指定的一个或多个中间件函数以及可选的安装路径path，默认为“ /”。
// 此方法类似于app.use（）。下面描述了一个简单的示例和用例。有关更多信息，请参见app.use（）。
// 中间件就像管道：请求从定义的第一个中间件功能开始，并按照它们匹配的每个路径“向下”进行中间件堆栈处理。
//以下是路由表的use  必须先命中第一个路由表  才能进入后面的indexRouter 等 注意！
app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/pro', proRouter);
app.use('/order', orderRouter);
app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/login',loginRouter)
app.use('/register',registerRouter)











// //session 路由守卫
// app.use(
//   session({
//     //session 加密信息
//     secret: "gfgfg",
//     //强制保存 官方建议false
//     resave: false,
//     //初始化session 存储 true
//     saveUninitialized: true,
    
//     //设置过期时间
//     cookie: { maxAge: 1000 * 10*60 },
//   })
// );

// //session 路由守卫
// app.all("*", (req, res, next) => {
//   console.log("进入全局路由守卫");
//   //这一步秘问前端那个秘闻 已经找到  藏在服务器的session是什么了 req.session.islogin = 'ok'
//   console.log(req.session);
//   if (
//     req.session.islogin === "ok" ||
//     req.url === "/login" ||
//     req.url === "/login/in"
//   ) {
//     console.log("next之前");
//     next();
//   } else {
//     console.log("守卫路由else");
//      res.redirect("/login");
//   }
// });













//九、 app.use没有给前端返回数据时，他是一个中间件  没连接时，渲染这个页面
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});




//十、 error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
