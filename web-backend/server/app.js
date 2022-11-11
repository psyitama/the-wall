const Express = require("express");
const BodyParser = require("body-parser");
const Path = require("path");
const Session = require("express-session");
const UserRoutes = require("./routes/user.routes");
const WallRoutes = require("./routes/wall.routes");

const Constants = require("./config/constants");
const App = Express();

App.use(BodyParser.json({limit: "50mb"}));
App.use(BodyParser.urlencoded({limit: "50mb", extended: true}));
App.set("view engine", "ejs");
App.set("views", Path.join(__dirname, "../", "/views"));
App.use("/assets", Express.static(Path.join(__dirname, "../", "/assets")));

App.use(Session({
    secret: Constants.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

App.use("/", UserRoutes);
App.use("/wall", WallRoutes);

App.listen(Constants.PORT, () => {
    console.log(`The Wall app listening on port ${Constants.PORT}, PID ${process.pid}`);
});