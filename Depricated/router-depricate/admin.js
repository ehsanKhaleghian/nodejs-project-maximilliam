const express=require("express")
const path=require("path")

const router=express.Router()

//به خاطر فرق کردن متود ها میتونیم روت جفتشون رو یکی کنیم

router.get("/product",(req,res)=>{
    res.sendFile(path.join(__dirname,"../","views","add-product.html"))
})

//**استفاده از یوز باعث میشود که برای همه ی متود ها کار کند */
//**برای جلوگیری از آن میتوان از پست استفاده کرد */
// app.use("/product",(req,res)=>{
//     console.log("RES BODY:::",res.body) // بدست آوردن بادی مربوط به ریسپانس
//     res.redirect("/my-route") // ریدایرکت
// })
router.post("/product",(req,res)=>{
    console.log("RES BODY:::",res.body) // بدست آوردن بادی مربوط به ریسپانس
    res.redirect("/admin/my-route") // ریدایرکت
});

router.get("/my-route",(req,res,next)=>{
    res.send("<h3>welcome to my route</h3>")
})

module.exports=router