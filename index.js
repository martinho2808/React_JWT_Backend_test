const express = require("express");
const bodyParser = require("body-parser");

const app = express();

const users = require("./users");

const axios = require("axios");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const config = require("./config");

app.use(bodyParser.json());
app.use(cors());

const UserService = require("./Service/UserService");
const UserRouter = require("./routers/UserRouter");

const userService = new UserService();

const auth = require("./auth")();
app.use(auth.initialize());

app.use(
  "/api/user/",
  auth.authenticate(),
  new UserRouter(userService).router()
);

app.post("/auth/login", function (req, res) {
  if (req.body.email && req.body.password) {
    var email = req.body.email;
    var password = req.body.password;

    console.log(email, password);
    var user = users.find((u) => {
      return u.email === email && u.password === password;
    });
    if (user) {
      var payload = {
        id: user.id
      };
      console.log(payload);
      var token = jwt.sign(payload, config.jwtSecret);
      console.log(token);
      res.json({
        token: token
      });
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(401);
  }
});

// this code is for facebook login - we cover this in the next section of the LMS
app.post("/api/login/facebook", function (req, res) {
  if (req.body.access_token) {
    var accessToken = req.body.access_token;

    axios
      .get(`https://graph.facebook.com/me?access_token=${accessToken}`)
      .then((data) => {
        if (!data.data.error) {
          var payload = {
            id: accessToken
          };
          users.push({
            id: accessToken, // better to use DB auto increment ID
            name: "Facebook User", // better to use data or profile to check the facebook user name
            email: "placeholder@gmail.com", // better to use data or profile to check the email
            password: ""
          });
          // Return the JWT token after checking
          console.log("success");
          var token = jwt.sign(payload, config.jwtSecret);
          res.json({
            token: token
            // optionally provide also the user id to frontend
          });
        } else {
          res.sendStatus(401);
        }
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(401);
      });
  } else {
    res.sendStatus(401);
  }
});

//We actually dont need to serve anything.. We are just using this backend to authenticate through our local-jwt-login or through facebook.
// Our frontend handles the pages that we will see.
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(8080, () => {
  console.log(`Application listening to port 8080`);
});
