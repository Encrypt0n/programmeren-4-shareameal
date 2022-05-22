const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const authRoutes = require('./src/routes/authentication.routes')
const userRoutes = require('./src/routes/user.routes')
require('dotenv').config();
const logger = require('./src/config/config').logger

const bodyParser = require("body-parser");
app.use(bodyParser.json());
const router = require('./src/routes/user.routes');
const { get } = require("express/lib/response");

app.all("*", (req, res, next) => {
  const method = req.method;
  logger.debug(`Method ${method} is aangeroepen`);
  next();

});
//

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Welcome to Share A Meal",
  });
});

app.use('/api', userRoutes)
app.use('/api', authRoutes)

app.use(router);

app.use((err, req, res, next) => {
  res.status(err.status).json(err);
});

app.all("*", (req, res) => {
  res.status(401).json({
    status: 401,
    result: "End-point not found",
  });
});


app.listen(port, () => {
  logger.debug(`Example app listening on port ${port}`);
});

module.exports = app;
