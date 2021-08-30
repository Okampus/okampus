const Router = require('express')
const { getURL } = require('@api/api.config.js')

const router = Router()
router.use(getURL('oauth'), require('./oauth'))

module.exports = router
