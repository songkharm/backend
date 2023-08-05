const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
};

router.post("/login", (req, res, next) => {
  try {
    const { username, password } = req.body;

    const sql =
      "SELECT id, username, age, email, address, contact FROM user WHERE username = ? AND password = ?";
    const params = [username, password];
    db.query(sql, params, (err, result) => {
      if (err) throw err;
      console.log(result);
      if (result.length > 0) {
        const token = jwt.sign(
          { id: result[0].id },
          "khfbewi45egegj88erwggh00"
        );

        const data = {
          success: true,
          message: "Login success",
          data: {
            token: token,
            user: result[0],
          },
        };

        res.send(data);
      } else {
        const data = {
          success: false,
          message: "Login fail",
          data: {},
        };

        res.send(data);
      }
    });
  } catch (err) {
    next(err);
  }
});

router.post("/register", (req, res) => {
  const { username, password, age } = req.body;

  const checkUsername = "SELECT id FROM user WHERE username = ?";
  const checkUsernameParams = [username];
  db.query(checkUsername, checkUsernameParams, (err, result) => {
    if (err) next(err);

    if (result.length > 0) {
      res.send("Username is exist");
    } else {
      const sql = "INSERT INTO user (username, password, age) VALUES (?,?,?)";
      const params = [username, password, age];
      db.query(sql, params, (err, result) => {
        if (err) throw err;

        res.send("Register success");
      });
    }
  });
});
router.use(errorHandler);

module.exports = router;
