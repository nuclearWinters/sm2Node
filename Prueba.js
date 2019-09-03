const sql = require('mssql')
const express = require('express')
const app = express()

const config = {
    user: 'sa',
    password: '@sm2sm2Programad0res',
    server: "192.168.1.101",
    database: 'difusion_integral_test',
    options: {
        encrypt: true
    }
}

// async/await style:
const pool1 = new sql.ConnectionPool(config);
const pool1Connect = pool1.connect();

pool1.on('error', err => {
    console.log(err)
})

app.get('/983', async (req, res) => {
    await pool1Connect; // ensures that the pool has been created
    try {
    	const request = pool1.request()
        const result = await request.query("SELECT * FROM contactos WHERE contactos.telefono_uno like '983_______'")
        let numbers = result.recordset.map(res => res.telefono_uno)
        res.send(numbers)
    } catch (err) {
        console.error('SQL error', err);
        res.send("Error")
    }
})

app.get('/984', async (req, res) => {
    await pool1Connect; // ensures that the pool has been created
    try {
    	const request = pool1.request()
        const result = await request.query("SELECT * FROM contactos WHERE contactos.telefono_uno like '984_______'")
        let numbers = result.recordset.map(res => res.telefono_uno)
        res.send(numbers)
    } catch (err) {
        console.error('SQL error', err);
        res.send("Error")
    }
})

app.get('/987', async (req, res) => {
    await pool1Connect; // ensures that the pool has been created
    try {
    	const request = pool1.request()
        const result = await request.query("SELECT * FROM contactos WHERE contactos.telefono_uno like '987_______'")
        let numbers = result.recordset.map(res => res.telefono_uno)
        res.send(numbers)
    } catch (err) {
        console.error('SQL error', err);
        res.send("Error")
    }
})

app.get('/997', async (req, res) => {
    await pool1Connect; // ensures that the pool has been created
    try {
    	const request = pool1.request()
        const result = await request.query("SELECT * FROM contactos WHERE contactos.telefono_uno like '997_______'")
        let numbers = result.recordset.map(res => res.telefono_uno)
        res.send(numbers)
    } catch (err) {
        console.error('SQL error', err);
        res.send("Error")
    }
})

app.get('/998', async (req, res) => {
    await pool1Connect; // ensures that the pool has been created
    try {
    	const request = pool1.request()
        const result = await request.query("SELECT * FROM contactos WHERE contactos.telefono_uno like '998_______'")
        let numbers = result.recordset.map(res => res.telefono_uno)
        res.send(numbers)
    } catch (err) {
        console.error('SQL error', err);
        res.send("Error")
    }
})

app.listen(3000)