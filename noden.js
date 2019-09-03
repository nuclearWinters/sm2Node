const axios = require('axios')

axios.get('https://quintanaroo.gob.mx/styps/encabeza-catalina-portillo-la-segunda-sesion-ordinaria-2019-de-la-comision-consultiva-de')
.then(
    messages => console.log(messages.data)
)