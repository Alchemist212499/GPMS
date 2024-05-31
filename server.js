require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");

//const { connectDB } = require("./config/db");
const port = process.env.PORT;

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
//app.use(cors(corsOptions));
app.use(cors());

// built-in middleware to handle urlencoded data
app.use(
  express.urlencoded({
    extended: true,
  })
);

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// routes
//app.use("/login", require("./routes/login"));
app.use("/auth", require("./routes/auth"));

//app.use(verifyJWT);
app.use("/users", require("./routes/api/users"));
app.use("/rpa", require("./routes/api/rpa"));
app.use("/rps", require("./routes/api/rps"));
app.use("/spa", require("./routes/api/spa"));
app.use("/score", require("./routes/api/score"));

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.listen(port, () => {
  console.log(`GPMS listening at http://localhost:${port}`);
});
