const express = require('express')
const app = express()
const mongoose = require('mongoose')
let cors = require('cors')
const dotenv = require('dotenv')
const diplomasRoutes = require('./routes/diplomaRoutes.js')
const groupsRoutes = require('./routes/groupsRoutes.js')
const sessionsRoutes = require('./routes/sessionsRoutes.js')
const userSessionRoutes = require('./routes/userSessionRoutes.js')
const usersRoutes = require('./routes/usersRoute.js')
const authRoutes = require('./routes/authRoutes.js')
const cookieParser = require('cookie-parser')

app.use(cors({
    origin : 'http://localhost:3000',
    credentials : true
}))

dotenv.config()
//ok
app.use(express.json())
app.use(cookieParser())

app.listen(process.env.PORT,()=>{
    console.log('Server Started')
})

mongoose.connect(process.env.LOCALDB).then(()=>{
    console.log('DB Connected')
})

app.use('/api/diplomas/',diplomasRoutes)
app.use('/api/groups/',groupsRoutes)
app.use('/api/sessions/',sessionsRoutes)
app.use('/api/usersession/',userSessionRoutes)
app.use('/api/users',usersRoutes)
app.use('/api/auth',authRoutes)
