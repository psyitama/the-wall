const Express = require("express");
const WallControllers = require("../controllers/wall.controllers");

const WallRoutes = Express.Router();

WallRoutes.get("/", (req, res) => { new WallControllers(req, res).wallForum(); });
WallRoutes.post("/post_message", (req, res) => { new WallControllers(req, res).postMessage(); });
WallRoutes.post("/post_comment", (req, res) => { new WallControllers(req, res).postComment(); });
WallRoutes.post("/delete_message", (req, res) => { new WallControllers(req, res).deleteMessage(); });
WallRoutes.post("/delete_comment", (req, res) => { new WallControllers(req, res).deleteComment(); });

WallRoutes.options("*", (req, res, next) => {
    next();
});

module.exports = WallRoutes;