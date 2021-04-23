var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
// var logger = require("morgan");
var config = require("config");
var mongoose = require("mongoose");

var utils = require("./common/utils");
var appointmentRouter = require("./routes/appointment");
var medicationRouter = require("./routes/medication");
var patientRouter = require("./routes/patient");
const swaggerJSDoc = require("swagger-jsdoc");

var connStr = utils.getConectionString();
mongoose.connect(connStr, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);
var db = mongoose.connection;
db.on(
    "error",
    console.error.bind(
        console,
        "Database connection failed. string " + connStr + " :",
    ),
);
db.once("open", function () {
    console.log("Database is connected. connection string " + connStr);
});

var app = express();
var cors = require("cors");
app.use(cors());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/appointment", appointmentRouter);
app.use("/medication", medicationRouter);

app.use("/patients", patientRouter);

// Swagger definition
var swaggerDefinition = {
    info: {
        title: "Hospital Management System",
        version: "1.0.0",
        description: "Hospital CRUD using Swagger API and MongoDB",
    },
    host: config.project.url,
    basePath: "/",
};

// Options for the swagger docs
var options = {
    swaggerDefinition: swaggerDefinition,
    apis: ["./routes/*.js"],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);

// serve swagger
app.get("/swagger.json", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
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

console.log(`Application is running on ${config.project.url} ...`);
module.exports = app;
