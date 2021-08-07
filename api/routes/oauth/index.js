const Router = require('express')
const { getURL } = require('@api/routes.config.js')

const router = Router()
router.use(getURL('oauth.discord'), require('./discord.route'))
console.log(`DISCORD ROUTE ${getURL('oauth.discord')}`)

module.exports = router
