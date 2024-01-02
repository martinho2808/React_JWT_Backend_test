const express = require("express");

class UserRouter {
  constructor(userService) {
    this.userService = userService;
  }
  router() {
    let router = express.Router();

    router.get("/", this.get.bind(this));
    console.log("In the user router");

    return router;
  }

  get(req, res) {
    console.log("reached user backend");
    return res.json(this.userService.list());
  }
}

module.exports = UserRouter;
