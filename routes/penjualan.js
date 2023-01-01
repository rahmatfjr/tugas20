var express = require('express');
var router = express.Router();
const { currencyFormatter } = require('../helper/util')
const moment = require('moment')

module.exports = function (db) {
    router.get('/', async function (req, res, next) {
        try {
            const { rows } = await db.query('SELECT * FROM penjualan');
            const noInvoice = req.query.noInvoice ? req.query.noInvoice : rows.length > 0 ? rows[0].no_invoice : '';
            const details = await db.query('SELECT dp.*, b.nama_barang FROM detail_penjualan as dp LEFT JOIN barang as b ON dp.id_barang = b.id_barang WHERE dp.no_invoice = $1 ORDER BY dp.id_detail', [noInvoice]);
            console.log(req.query.noInvoice, noInvoice)
            res.render('penjualan/list', {
                currentPage: 'penjualan',
                rows,
                currencyFormatter,
                moment,
                details: details.rows
            });
        }
        catch (e) {
            // console.log(e)
            res.send(e)
        }
    });
    router.get('/create', async function (req, res) {
        try {
            const { rows } = await db.query('INSERT INTO penjualan(total_harga) VALUES(0) returning *')
            res.redirect(`/penjualan/show/${rows[0].no_invoice}`)
        }
        catch {
            res.send(e)
        }
    })

    router.get('/show/:no_invoice', async function (req, res) {
        try {
            const penjualan = await db.query('SELECT * FROM penjualan WHERE no_invoice = $1', [req.params.no_invoice])
            const { rows } = await db.query('SELECT id_barang, nama_barang FROM barang ORDER BY id_barang')
            res.render('penjualan/form', {
                currentPage: 'penjualan',
                barang: rows,
                penjualan: penjualan.rows[0],
                moment
            })
        }
        catch {
            res.send(e)
        }
    })

    router.get('/barang/:id_barang', async function (req, res) {
        try {
            const { rows } = await db.query('SELECT * FROM barang WHERE id_barang = $1', [req.params.id_barang]);
            res.json(rows[0])
        }
        catch(e) {
            res.send(e)
        }
    })

    router.post('/additem', async function (req, res) {
        try {
            const detail = await db.query('INSERT INTO detail_penjualan(no_invoice, id_barang, qty)VALUES ($1, $2, $3) returning *', [req.body.no_invoice, req.body.id_barang, req.body.qty]);
            const { rows } = await db.query('SELECT * FROM penjualan WHERE no_invoice = $1', [req.body.no_invoice])
            console.log(rows)
            res.json(rows[0])
        }
        catch(e) {
            console.log(e)
            res.send(e)
        }
    })

    router.get('/details/:no_invoice', async function (req, res) {
        try {
            const {rows} = await db.query('SELECT dp.*, b.nama_barang FROM detail_penjualan as dp LEFT JOIN barang as b ON dp.id_barang = b.id_barang WHERE dp.no_invoice = $1 ORDER BY dp.id_detail', [req.params.no_invoice]);
            // console.log(rows)
            res.json(rows)
        }
        catch(e) {
            // console.log(e)
            res.send(e)
        }
    })

    router.get('/delete/:no_invoice', async function (req, res) {
        try {
            const { rows } = await db.query('DELETE FROM penjualan WHERE no_invoice = $1', [req.params.no_invoice])
            delPen = await db.query('DELETE FROM penjualan_detail WHERE no_invoice = $1', [req.params.no_invoice])
            res.redirect('/penjualan')
        } catch (e) {
            console.log(e)
            res.render(e)
        }
    })
    return router;
}

