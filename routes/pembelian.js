var express = require('express');
var router = express.Router();

module.exports = function (db) {
    /* GET users listing. */
    router.get('/', async function (req, res, next) {
        try {
            const { rows } = await db.query('SELECT * FROM pembelian ')
            res.render('barang')
        }
        catch (e) {

        }
    });

    return router;
}