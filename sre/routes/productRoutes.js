const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/product', (req, res) => {
    db.query('SELECT * FROM product',(err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


router.post('/product', (req, res) => {
    const { name, price, quantity } = req.body;

    const sql = 'INSERT INTO product(name, price, quantity) VALUES(?,?,? )';
    const params = [name, price, quantity];

    db.query(sql, params, (err, result) => {
        if (err) throw err;
        res.send("Insert success");
    });
});

router.put('/product', (req, res) => {
    const { name, price, quantity , id } = req.body;

    const sql = 'UPDATE product SET name = ?, price = ?,  quantity = ? WHERE id = ? ';
    const params = [name, price, quantity , id];

    db.query(sql, params, (err, result) => {
        if (err) throw err;
        res.send("Update success!");
    });
})

router.delete('/product/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM product  WHERE id = ? ';
    const params = [ id];

    db.query(sql, params, (err, result) => {
        if (err) throw err;
        res.send("Delete success!");
    });
})


module.exports = router