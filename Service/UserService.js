const users = require("../users");

class UserService {
  constructor() {}

  list() {
    console.log("listing user");
    return users.map((user) => Object.assign({}, { name: user.name }));
  }
}

module.exports = UserService;
