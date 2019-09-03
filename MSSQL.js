const sql = require('mssql')
const express = require('express')
const app = express()

const config = {
    user: 'sa',
    password: '@sm2sm2Programad0res',
    server: "192.168.1.110",
    database: 'difusion_integral',
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

app.get('/prueba', async (req, res) => {
    await pool1Connect; // ensures that the pool has been created
    try {
    	const request = pool1.request()
        const result = await request.query(`use difusion_integral;
        select * from contactos
        inner join cat_etiquetas_contactos on cat_etiquetas_contactos.contacto_id = contactos.id
        inner join cat_etiquetas on cat_etiquetas.id = cat_etiquetas_contactos.cat_etiqueta_id
        where cat_etiquetas.name = 'sm2'
        and contactos.activo = 1;`)
        let numbers = result.recordset.map(res => res.telefono_uno)
        res.send(numbers)
    } catch (err) {
        console.error('SQL error', err);
        res.send("Error")
    }
})

app.get('/etiquetas', async (req, res) => {
    await pool1Connect; // ensures that the pool has been created
    try {
    	const request = pool1.request()
        const result = await request.query(`select * from cat_etiquetas`)
        let numbers = result.recordset.map(res => res.name)
        res.send(numbers)
    } catch (err) {
        console.error('SQL error', err);
        res.send("Error")
    }
})

app.get('/filter', async (req, res) => {
    const {etiqueta, lada} = req.query
    await pool1Connect; // ensures that the pool has been created
    try {
        let query = ""
        if (etiqueta && lada) {
            query = `use difusion_integral;
            select * from contactos
            inner join cat_etiquetas_contactos on cat_etiquetas_contactos.contacto_id = contactos.id
            inner join cat_etiquetas on cat_etiquetas.id = cat_etiquetas_contactos.cat_etiqueta_id
            where cat_etiquetas.name = '${etiqueta}' and contactos.telefono_uno like '${lada}_______'
            and contactos.activo = 1;`
        } else if (!etiqueta && lada) {
            query = `use difusion_integral;
            select * from contactos
            inner join cat_etiquetas_contactos on cat_etiquetas_contactos.contacto_id = contactos.id
            inner join cat_etiquetas on cat_etiquetas.id = cat_etiquetas_contactos.cat_etiqueta_id
            where contactos.telefono_uno like '${lada}_______'
            and contactos.activo = 1;`
        } else if (etiqueta && !lada) {
            query = `use difusion_integral;
            select * from contactos
            inner join cat_etiquetas_contactos on cat_etiquetas_contactos.contacto_id = contactos.id
            inner join cat_etiquetas on cat_etiquetas.id = cat_etiquetas_contactos.cat_etiqueta_id
            where cat_etiquetas.name = '${etiqueta}'
            and contactos.activo = 1;`
        } else {
            res.send([])
            return
        }
    	const request = pool1.request()
        const result = await request.query(query)
        let numbers = result.recordset.map(res => res.telefono_uno)
        res.send(numbers)
    } catch (err) {
        console.error('SQL error', err);
        res.send("Error")
    }
})

app.listen(3000)