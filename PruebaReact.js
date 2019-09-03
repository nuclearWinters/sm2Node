const express = require('express')
const app = express()

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.get('/ejemplo', (req, res) => {
    console.log(req.query)
    res.json([{nombre: "Armando"}, {nombre: "Ruben"}, {nombre: "Carlos"}, {nombre: "Sydney"}])
})

app.listen(3001)

/*http://192.168.1.66:3001/ejemplo*/