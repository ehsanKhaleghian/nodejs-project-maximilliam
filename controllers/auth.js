const User = require("../models/user");
const bcrypt = require("bcryptjs");
//**Mailing service */
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
    sendgridTransport({
        //**The api key can be given from sendgrid site-->setting-->apikey */
        auth: {
            api_key:
                "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",
        },
    })
);
exports.getLogin = (req, res, next) => {
    //**Gaining information from cookie */
    //**One disadvantage of using cookie is that every user can change it in the  */
    //**    dev tool. So we can use session instead */
    // const isLoggedIn = req.get("Cookie").split(";")[10].trim().split("=")[1];
    let message = req.flash("error");
    if (message.lenght) {
        message = message[0];
    } else message = null;
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        //**This key: "error" is given from req.flash("error",.....) */
        errorMessage: message,
    });
};

exports.postLogin = (req, res, next) => {
    //**It will not work because redirect will create a brand new req and res and isLoggedIn item  */
    //**    will not be there anymore */
    // req.isLoggedIn = true;

    //**For setting a cookie we use this way. */
    //**Set-Cookie is a reserved name and after that there is key=value pair */
    //**Browser by default sends the cookie to the server in every request */
    //**HttpOnly used for more security that hackers couldn't access data between server and client */
    //**    only client access these data. */
    //**We have package that manage cookies and it is not needed to implement it by ourself */
    // res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");
    /* -------------------------------------------------------------------------- */
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then((user) => {
            if (!user) {
                req.flash("error", "Invalid email or password.");
                return res.redirect("/login");
            }
            bcrypt
                .compare(password, user.password)
                .then((doMatch) => {
                    if (doMatch) {
                        //**Using session instead of cookie: */
                        //**Session is different on every browsers */
                        //**Now we can find isLoggedIn and jafar with their values in the database */
                        req.session.isLoggedIn = true;
                        req.session.jafar = "mamad";
                        req.session.user = user;
                        //**To ensure that the session is created in the database and after that continue the rest of work */
                        //**    we use save(()=>{}) */
                        return req.session.save((err) => {
                            console.log(err);
                            res.redirect("/");
                        });
                    }
                    req.flash("error", "Invalid email or password.");
                    res.redirect("/login");
                })
                .catch((err) => res.redirect("/login"));
        })
        .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then((userDoc) => {
            if (userDoc) {
                req.flash(
                    "error",
                    "Email exists already, please pick a different one."
                );
                return res.redirect("/signup");
            }
            //**Using bcrypt package to encrypt password */
            return bcrypt
                .hash(password, 12)
                .then((hashedPassword) => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] },
                    });
                    //**For saving in database */
                    return user.save();
                })
                .then((result) => {
                    res.redirect("/login");
                    //**Sending Email for user and we should send email in a blocking mode*/
                    return transporter.sendMail({
                        to: email,
                        from: "shop@ehsan-shop.com",
                        subject: "Signup succeeded",
                        html: "<h1>You Successfully signed up!</h>",
                    });
                });
        })
        .catch((err) => console.log(err));
};

exports.getSignup = (req, res, next) => {
    let message = req.flash("error");
    if (message.lenght) {
        message = message[0];
    } else message = null;
    res.render("auth/signup", {
        path: "/signup",
        pageTitle: "Signup",
        //**This key: "error" is given from req.flash("error",.....) */
        errorMessage: message,
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash("error");
    if (message.lenght) {
        message = message[0];
    } else message = null;
    res.render("auth/reset", {
        path: "/reset",
        pageTitle: "Reset Password",
        //**This key: "error" is given from req.flash("error",.....) */
        errorMessage: message,
    });
};
