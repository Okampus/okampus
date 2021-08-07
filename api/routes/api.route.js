const Router = require('express')
const { getURL } = require('@api/routes.config.js')

const router = Router()
router.use(getURL('oauth'), require('./oauth'))
console.log(`OAUTH ROUTE ${getURL('oauth')}`)

module.exports = router
