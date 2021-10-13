const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    //**Gaining information from cookie */
    //**One disadvantage of using cookie is that every user can change it in the  */
    //**    dev tool. So we can use session instead */
    const isLoggedIn = req.get("Cookie").split(";")[10].trim().split("=")[1];
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        isAuthenticated: isLoggedIn,
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

    //**Using session instead of cookie: */
    //**Session is different on every browsers */
    req.session.isLoggedIn = true;
    res.redirect("/");
};
