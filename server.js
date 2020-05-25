const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')

const adminRouter = require('./routers/adminRouter').router
const authRouter = require('./routers/authRouter').router

const cors = require('cors')

const app = express()
app.use(helmet())
app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json())

app.use('/admin/', adminRouter)
app.use('/auth/', authRouter)

app.listen(8080, () => console.log('Serveur lancé sur le port 8080'))
