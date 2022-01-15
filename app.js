require("dotenv").config();

const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const morgan = require("morgan");
const passport = require("passport");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

mongoose.connect(process.env.MONGO_URI);

app.use(morgan("dev"));
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: true,
	})
);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session);
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

const indexRouter = require("./routes/index");

app.use("/", indexRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server start on localhost:${port}`));
