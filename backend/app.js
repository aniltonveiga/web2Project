var createError = require("http-errors"),
  express = require("express"),
  path = require("path"),
  cookieParser = require("cookie-parser"),
  bodyParser = require("body-parser"),
  logger = require("morgan"),
  mongoose = require("mongoose"),
  hbs = require("hbs"),
  indexRouter = require("./routes/index"),
  usersRouter = require("./routes/user"),
  chatRouter = require("./routes/chat"),
  session = require("express-session");

var app = express();

// Motor de template
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerHelper("ifEquals", function(arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});
//Conexão com o mongo
var mongoDB =
  "mongodb+srv://teste:teste@cluster0-tfmad.gcp.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.connection.on("connected", function() {
  console.log("Mongoose default connection open");
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
app.use(bodyParser.json());
// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "teste2",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//app.use(morgan('dev'));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use("/chat", chatRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});


app.listen(process.env.PORT|| 5000 );
module.exports = app;