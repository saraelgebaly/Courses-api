const express =  require('express')
const cors= require('cors')

require('dotenv').config()

const  app = express()
const mongoose = require('mongoose')
const url = process.env.URL
mongoose.connect(url).then(()=>{
    console.log('Connected to MongoDB');
})
const httpStatusText = require('./utils/httpStatusText')

app.use(cors())
app.use(express.json()) 




const coursesRouter = require('./routes/courses')
const userRouter = require('./routes/user')
app.use('/api/courses', coursesRouter)
app.use('/api/user', userRouter)
app.all('*', (req, res, next)=> {
    return res.status(404).json({ status: httpStatusText.error, message: 'this resource is not available'})
})
app.use((error , req , res , next)=> {
res.status(error.statusCode|| 500)
.json({status: error.statusText || httpStatusText.error, message: error.message , code: error.codeStatus })
}) 
 












app.listen(process.env.PORT ||  5050 , () => {
    console.log("listening on port:5050")
})