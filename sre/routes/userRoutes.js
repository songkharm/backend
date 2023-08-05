const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");

router.get("/users", (req, res, next) => {
  db.query("SELECT * FROM user", (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

router.get("/user", (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(" ")[1];

    const verifyToken = jwt.verify(token, "khfbewi45egegj88erwggh00");
    const spl =
      "SELECT id, username, age, email, address, contact FROM user WHERE id = ?";

    const params = [verifyToken.id];

    db.query(spl, params, (err, result) => {
      if (err) next(err);

      const data = {
        success: true,
        message: "Get user success",
        data: result[0],
      };

      res.send(data);
    });
  } catch (err) {
    next(err);
  }
});

router.post("/users", (req, res, next) => {
  const { username, age } = req.body;

  const sql = "INSERT INTO user(username, age) VALUES(?,? )";
  const params = [username, age];

  db.query(sql, params, (err, result) => {
    if (err) throw err;
    res.send("Insert success");
  });
});

router.put("/user", (req, res) => {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader.split(" ")[1];

  const verifyToken = jwt.verify(token, "khfbewi45egegj88erwggh00");

  const { username, age, email, address, contact } = req.body;

  const sql =
    "UPDATE user SET username = ?, age = ?, email = ?, address = ?, contact = ? WHERE id = ? ";
  const params = [username, age, email, address, contact, verifyToken.id];

  db.query(sql, params, (err, result) => {
    if (err) throw err;
    const getUserSql =
      "SELECT id, username, age, email, address, contact FROM user WHERE id = ?";
    const getUserParams = [verifyToken.id];

    db.query(getUserSql, getUserParams, (err, result) => {
      if (err) next(err);

      const data = {
        success: true,
        message: "Update user success",
        data: result[0],
      };

      res.send(data);
    });
  });
});

router.delete("/user/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM user  WHERE id = ? ";
  const params = [id];

  db.query(sql, params, (err, result) => {
    if (err) throw err;
    res.send("Delete success");
  });
});

module.exports = router;
