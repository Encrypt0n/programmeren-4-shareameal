let database = [];
let id = 0;

let controller = {
    addUser(req,res) {
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
        };
    },
    getAllUsers(req,res) {
        res.status(200).json({
            status: 200,
            result: database,
          });
    },
    getUserById(req,res) {
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
    }
}

module.exports = controller;