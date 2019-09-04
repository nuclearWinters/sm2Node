const sql = require('mssql')
const express = require('express')
const app = express()
const uuid = require("uuid/v4")
const bodyParser = require("body-parser")

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false}))

const config = {
    user: 'sa',
    password: '@sm2sm2Programad0res',
    server: "192.168.1.110",
    database: 'difusion_integral_armando',
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

app.post('/crear_cotejo', async (req, res) => {
    const { nombre, etiqueta, lada, mensaje } = req.body
    console.log( nombre, etiqueta, lada, mensaje )
    await pool1Connect; // ensures that the pool has been created
    try {
        let query = `use difusion_integral_armando; select * from cat_grupo_envio where nombre = '${nombre}'`
        const request = pool1.request()
        const result = await request.query(query)
        console.log(result)
        if (result.recordset.length !== 0) {
            throw "el nombre ya existe"
        } else {
            const queryUUID = uuid()
            let filters = ""
            if (etiqueta && lada) {filters = `where cat_etiquetas.name = '${etiqueta}' and contactos.telefono_uno like '${lada}_______'`}
            else if (!etiqueta && lada) {filters = `where contactos.telefono_uno like '${lada}_______'`}
            else if (etiqueta && !lada) {filters = `where cat_etiquetas.name = '${etiqueta}'`}
            else {filters = `where cat_etiquetas.name = 'sm2'`}
            let query = `use difusion_integral_armando;
            BEGIN TRANSACTION;  
                INSERT INTO cat_grupo_envio (id, nombre, mensaje) VALUES ('${queryUUID}', '${nombre}', '${mensaje}')
                INSERT INTO bandeja_salida (cat_envio_id, contacto_id, enviado, numero) select '${queryUUID}', contactos.id, 0, contactos.telefono_uno from contactos
                    inner join cat_etiquetas_contactos on cat_etiquetas_contactos.contacto_id = contactos.id
                    inner join cat_etiquetas on cat_etiquetas.id = cat_etiquetas_contactos.cat_etiqueta_id
                    ${filters}
                    and contactos.activo = 1
            COMMIT;`
            const request = pool1.request()
            const result = await request.query(query)
            console.log(result)
        }
        res.json({})
    } catch (err) {
        console.error('SQL error', err);
        res.send("Error")
    }
})

app.get('/obtener_cotejos', async (req, res) => {
    await pool1Connect; // ensures that the pool has been created
    try {
        let query = `select * from cat_grupo_envio`
        const request = pool1.request()
        const result = await request.query(query)
        res.json(result.recordset)
    } catch (err) {
        console.error('SQL error', err);
        res.send("Error")
    }
})

app.get('/obtener_cotejos_con_id_no_enviados', async (req, res) => {
    const { cotejo_id } = req.query
    await pool1Connect; // ensures that the pool has been created
    try {
        let query = `select * from bandeja_salida where cat_envio_id = '${cotejo_id}' and enviado = 0`
        const request = pool1.request()
        const result = await request.query(query)
        console.log(result)
        res.json(result.recordset)
    } catch (err) {
        console.error('SQL error', err);
        res.send("Error")
    }
})

app.put('/cambiar_registro_en_cotejo', async (req, res) => {
    const { envio_id } = req.body
    await pool1Connect; // ensures that the pool has been created
    try {
        let query = `
        UPDATE bandeja_salida
        SET enviado = 1
        WHERE id = '${envio_id}'`
        const request = pool1.request()
        const result = await request.query(query)
        console.log(result)
        res.json(result.recordset)
    } catch (err) {
        console.error('SQL error', err);
        res.send("Error")
    }
})

app.listen(3002)