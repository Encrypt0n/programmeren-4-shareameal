const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());

let database = [];
let id = 0;

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

app.post("/api/user", (req, res) => {

  let user = req.body;
  id++;
  user = {
    id,
    firstname: user.firstname,
    lastname: user.lastname,
    address: user.address,
    city: user.city,
    email: user.email,
    password: user.password,
    phone: user.phone,
    roles: user.roles
  };
  console.log(user);
  const found = database.some(item => item.email === user.email);
  if(!found) {
    database.push(user);
    res.status(201).json({
      status: 201,
      result: database,
    });
  } else {
    res.status(409).json({
      status: 409,
      result: `User with email ${user.email} already exists`,
    });
  }
});

app.get("/api/user/:userId", (req, res, next) => {
  const userId = req.params.userId;
  console.log(`User met ID ${userId} gezocht`);
  let user = database.filter((item) => item.id == userId);
  if (user.length > 0) {
    console.log(user);
    res.status(200).json({
      status: 200,
      result: user,
    });
  } else {
    res.status(401).json({
      status: 401,
      result: `User with ID ${userId} not found`,
    });
  }
});

app.get('/api/user/profile/:userId', (req, res) => {
  res.status(400).json({
    status: 404,
    result: 'Viewing the user profile is not implemented yet',
  });
});

app.delete("/api/user/:userId", (req, res, next) => {
  const userId = req.params.userId;
  let user = database.findIndex((item) => item.id == userId);
  console.log(user);
   if (user != -1) {
    console.log(user);
    database.splice(user);
    res.status(201).json({
      status: 201,
      result: `User met ID ${userId} verwijderd`,
    });
  } else {
    res.status(405).json({
      status: 405,
      result: `User with ID ${userId} not found`,
    });
  }
});

app.put("/api/user/:userId", (req, res, next) => {
  const userId = req.params.userId;
  console.log(userId);
  let user = req.body;
  let userIndex = database.findIndex((item) => item.id == userId);
  if (user != -1) {
    console.log(user);
    
    database[userIndex]= {
      id: userId,
      firstname: user.firstname,
      lastname: user.lastname,
      address: user.address,
      city: user.city,
      email: user.email,
      password: user.password,
      phone: user.phone,
      roles: user.roles
    };
    console.log(database);
    res.status(201).json({
      status: 201,
      result: `User met ID ${userId} aangepast`,
    });
  } else {
    res.status(401).json({
      status: 401,
      result: `User with ID ${userId} not found`,
    });
  }
});

app.get("/api/user", (req, res, next) => {
  res.status(200).json({
    status: 200,
    result: database,
  });
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
