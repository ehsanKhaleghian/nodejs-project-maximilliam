const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//Tellig express that we wanna compile dynamic templates by "pug" and next line---> where to find this engins
app.set("view engine", "pug");
//To determine which folder is our view -by default node consider the view folder which we mentioned earlier
app.set("views", "views");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));

//اضافه کردن فولدری که برای عموم دیدنش آزاد باشه
app.use(express.static(path.join(__dirname, "./public")));

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(7777);
