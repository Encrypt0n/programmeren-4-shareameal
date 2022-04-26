const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());
const router = require('./src/routes/user.routes');
const res = require("express/lib/response");

app.all("*", (req, res, next) => {
  const method = req.method;
  console.log(`Method ${method} is aangeroepen`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Welcome to Share A Meal",
  });
});

app.use(router);

app.use((err, res, req, next) => {
  res.status(err.status).json(err);
});

app.all("*", (req, res) => {
  res.status(401).json({
    status: 401,
    result: "End-point not found",
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
