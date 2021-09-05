const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const errorController = require("./controllers/error");

//Tellig express that we wanna compile dynamic templates by "pug" or "ejs" and next line---> where to find this engins
app.set("view engine", "ejs");
//To determine which folder is our view -by default node consider the view folder which we mentioned earlier
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));

//اضافه کردن فولدری که برای عموم دیدنش آزاد باشه
app.use(express.static(path.join(__dirname, "./public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

// app.use((req, res, next) => {
//     res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
// });

// app.use((req, res, next) => {
//     res.status(404).render("404", { pageTitle: "Page Not Found" });
// });

app.use(errorController.get404);

app.listen(7777);
