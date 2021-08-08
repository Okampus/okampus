require('module-alias/register')

// const errors = require('http-errors')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { ENV } = require('@api/routes.config.js')

// Connect mongoDB
mongoose.connect(ENV.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Database connected')
},
error => {
  console.log(`Error: Database could't be connected to (${error})`)
})

const app = express()
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))
app.use(cors({
  origin: true,
  credentials: true
}))
app.use(cookieParser())

app.listen(ENV.VUE_APP_API_PORT, () => {
  console.log(`Connected to port ${ENV.VUE_APP_API_PORT}`)
})

// API
app.use(ENV.VUE_APP_API_ROUTE, require('@api/routes/api.route'))
console.log(`API ROUTE ${ENV.VUE_APP_API_ROUTE}`)

// Find 404
app.use((req, res) => {
  // respond with json
  if (req.accepts('json')) {
    return res.json({ error: '404' })
  }

  // default to plain-text. send()
  res.type('txt').send('Not found')
})

// error handler
app.use(function (err, req, res) {
  console.error(err.message)
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.message)
})
