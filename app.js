const path = require("path");
//**Remove this string from end of mongodb conncetion */
const MONGODB_URI =
    "mongodb+srv://ehsanScript:E55268199Yk@cluster0.ytldu.mongodb.net/shop?retryWrites=true&w=majority";

const express = require("express");
const bodyParser = require("body-parser");
//**Here Mongoose is imported */
const mongoose = require("mongoose");
//**For using session middleware we import it here to access it in every render */
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

//**Connecting session middleware to the database */
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessoins",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
//**Setting for session API */
//**For every request:*/
//**    1- The middleware will register */
//**    2- The middleware will look for a session cookie */
//**    3- If it finds one then will look for feeding session in the database */
//**    3- Load data from the database */
app.use(
    session({
        //**Secret should be a long string */
        secret: "j;skfsjflskfjslfs;fkasdjfsfd",
        //**This means that session will not save on every response */
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    //**Find user by help of session and regiser it by mongoose to access its methods */
    User.findById(req.session.user._id)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
    .connect(MONGODB_URI)
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
