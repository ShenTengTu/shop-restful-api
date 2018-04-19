const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const productsRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/user')

const {DB_REMOTE_USER,DB_REMOTE_PW,DB_REMOTE_HOST} = process.env
mongoose.connect(`mongodb://${DB_REMOTE_USER}:${DB_REMOTE_PW}@${DB_REMOTE_HOST}/test?ssl=true&replicaSet=shop-restful-api-shard-0&authSource=admin`)

//Log middleware
app.use(morgan('dev'))

//static
app.use('/uploads',express.static('uploads'))

//Request body parser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//CORS Handling
app.use((req,res,next)=>{
  let prefix = 'Access-Control-Allow-'
  res.header(prefix+'Origin', '*')
  res.header(prefix+'Headers',
  'Origin, X-Requested-With, Content-Type, Accept, Authorization')

  if(req.method === 'OPTIONS'){
    res.header(prefix+'Methods',
    'PUT, POST, PATCH, DELETE, GET')
    //Use `return` because don't need to go to Routes
    return res.status(200).json({})
  }

  //end Handling,pass to next middleware
  next()
})

//Routes
app.use('/products',productsRoutes)
app.use('/orders',ordersRoutes)
app.use('/user',userRoutes)

//Request Error Handling (404)
app.use((req,res,next)=>{
  const error = new Error('Note found')
  error.status = 404
  //forward this error request here
  //instead of the original one essentially.
  next(error)
})

//All Error Handling response
app.use((error,req,res,next)=>{
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})


module.exports = app
