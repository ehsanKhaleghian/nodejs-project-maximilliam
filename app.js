const express = require("express");

const adminRoute=require("./router/admin");
const shopRoute=require("./router/shop");

//پکیج باید نصب بشه تا بتونیم ریسپانس رو پارس کنیم
//npm install --save body-parser

const app=express();

//برای استفاده از بادی پارسر
const bodyParser=require("body-parser");

app.use(bodyParser.urlencoded({extended:false}));
//----------------------------------------------------------------------//


//اضافه شدن به اولشون بدون اینکه داخل خود فایل ادمین رو بنویسیم
app.use("/admin",adminRoute);
app.use(shopRoute)

//برای هندل کردن 404 در آخرین خط کد پایین رو میزنیم
//همچنینی به آن استیتوس میدیم
app.use((req,res,next)=>{
    res.status(404).send("<h1>Page Not Found</h1>")
})

app.listen(7777)
