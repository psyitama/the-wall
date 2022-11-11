const Express = require("express");
const UserControllers = require("../controllers/user.controllers");

const UserRoutes = Express.Router();

UserRoutes.get("/", (req, res) => { new UserControllers(req, res).homePage(); });
UserRoutes.post("/login", (req, res) => { new UserControllers(req, res).loginUser(); });
UserRoutes.post("/register", (req, res) => { new UserControllers(req, res).registerUser(); });
UserRoutes.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        res.status(200);
        res.redirect("/");
    });
});

UserRoutes.options("*", (req, res, next) => {
    next();
});

module.exports = UserRoutes;