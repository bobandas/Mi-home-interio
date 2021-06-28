var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const hbs = require("express-handlebars");
const db = require("./config/connection");
var {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access"); //error rectify byB
var session = require("express-session");
var adminHelpers = require("./Helpers/admin-helpers");

var indexRouter = require("./routes/index");
var adminRouter = require("./routes/admin");
const { urlCheck } = require("./Helpers/admin-helpers");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs({
    handlebars: allowInsecurePrototypeAccess(hbs),
  })
);
app.engine(
  "hbs",
  hbs({
    helpers: {
      inc: function (value, options) {
        return parseInt(value) + 1;
      },
    },
    defaultLayout: "Layout",
    extname: ".hbs",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/",
  })
);

app.use(logger("dev"));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: "580958095809", cookie: { maxAge: 1200000 } }));
db.connect((err) => {
  if (err) console.log("connection error" + err);
  else console.log("database connected successfully");
}); // db connect byB

app.use("/", indexRouter);
app.use("/admin", adminHelpers.validateLogin, adminRouter);
app.use("/admin/admin", (req, res) => {
  res.redirect("/admin");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
