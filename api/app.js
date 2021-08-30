require('module-alias/register')

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { ENV } = require('@api/api.config.js')

const ERROR_ROUTE = '/error'

// Connect to MongoDB
mongoose.connect(ENV.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Database connected')
},
error => {
  console.log(`Error: Database could't be connected to. Stacktrace: ${error}`)
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

// error
app.use(`${ERROR_ROUTE}/:status`, (req, res) => {
  // Respond with json
  if (req.accepts('json')) {
    return res.json({ error: req.params.status })
  }

  // Or default to plain-text
  res.type('txt').send('404: Not found')
})

// Find 404
app.use((req, res, next) => {
  throw (new Error('test'))
  // Respond with json
  /* if (req.accepts('json')) {
    return res.json({ error: '404' })
  }

  // Or default to plain-text
  res.type('txt').send('404: Not found') */
})

// error handler
app.use(function (err, req, res, next) {
  console.log('ERROR')
  console.error(err.message)
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.message)
})
