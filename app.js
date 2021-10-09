const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
//**Here Mongoose is imported */
const mongoose = require("mongoose");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById("615eb998f9f6d8535005d671")
        .then((user) => {
            //**The second user is the full mongoose model and we can call  */
            //**    all of the mongoose methods on that */
            req.user = user;
            next();
        })
        .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
    .connect(
        "mongodb+srv://ehsanScript:E55268199Yk@cluster0.ytldu.mongodb.net/shop?retryWrites=true&w=majority"
    )
    .then((result) => {
        //**Usig below method to find if there is a user that it doesn't */
        //**    create another one */
        User.findOne().then((user) => {
            if (!user) {
                //**Creating a new user before listening to the app */
                const user = new User({
                    name: "Ehsan",
                    email: "ehsan.khaleghian@gmail.com",
                    cart: {
                        items: [],
                    },
                });
                user.save();
            }
        });

        app.listen(7777);
    })
    .catch((err) => {
        console.log(err);
    });
