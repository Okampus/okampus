const Router = require('express')
const request = require('request')
const fetch = require('node-fetch')
const Discord = require('discord.js')

const { ENV, VUE_BASE, getURL } = require('@api/routes.config.js')
const { Serialize } = require('@api/routes/utils')

const bot = new Discord.Client()
bot.login(ENV.DISCORD_BOT_TOKEN)

bot.on('ready', () => {
  console.log(`BOT '${bot.user.username}' READY!`)
  console.log(`GUILDS: ${bot.guilds.cache.array()}`)
})

const DISCORD_USER_API_URL = 'https://discord.com/api/v6/users/@me'
const DISCORD_OAUTH_AUTH_URL = 'https://discord.com/api/oauth2/authorize'
const DISCORD_OAUTH_TOKEN_URL = 'https://discord.com/api/oauth2/token'

const TOKEN_SCOPE = 'identify email'

const router = Router()
router.route(getURL('oauth.discord.tokenIssuing')).get((req, res, next) => {
  return res.redirect(DISCORD_OAUTH_AUTH_URL +
    Serialize({
      response_type: 'code',
      scope: TOKEN_SCOPE,
      client_id: ENV.DISCORD_CLIENT_ID,
      redirect_uri: getURL('oauth.discord.tokenCallback', 'full')
    }))
})

router.route(getURL('oauth.discord.tokenCallback')).get(async (req, res, next) => {
  const OAuth = await fetch(DISCORD_OAUTH_TOKEN_URL, {
    method: 'POST',
    body: new URLSearchParams({
      client_id: ENV.DISCORD_CLIENT_ID,
      client_secret: ENV.DISCORD_CLIENT_SECRET,
      code: req.query.code,
      grant_type: 'authorization_code',
      redirect_uri: getURL('oauth.discord.tokenCallback', 'full'),
      scope: TOKEN_SCOPE
    }),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  const tokens = await OAuth.json()

  console.log('EXPIRES', tokens.expires_in * 1000, tokens, VUE_BASE)
  res.cookie('token', {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token
  }, { maxAge: tokens.expires_in * 1000 }).redirect(VUE_BASE)

  // request.get({ url: getURL('oauth.discord.userInfo', 'full') })
})

router.route(getURL('oauth.discord.userInfo')).get(async (req, res, next) => {
  // CHECK LOGGED IN
  let guild, member, user

  console.log(req.cookies)
  await request.get(
    {
      url: DISCORD_USER_API_URL,
      headers: {
        Authorization: `Bearer ${req.cookies.token.access_token}`
      }
    }, async (err, res, body) => {
      if (err) {
        console.log('Error:', err)
      } else {
        user = JSON.parse(body)

        console.log('Response:', res.statusCode, user)
        guild = bot.guilds.cache.get(ENV.DISCORD_GUILD_ID)
        member = await guild.members.fetch(user.id)
        if (member) {
          console.log(member)
          console.log(`${user.username} is a member of ${guild.name}`)
        } else {
          console.log(`${user.username} is not a member of ${guild.name}`)
        }
      }
    }
  )

  res.send({
    message: member
      ? `${user.username} is a member of ${guild.name}`
      : `${user.username} is not a member of ${guild.name}`,
    user: user
  })
})

console.log(`ISSUING ROUTE ${getURL('oauth.discord.tokenIssuing')}`)
console.log(`CALLBACK ROUTE ${getURL('oauth.discord.tokenCallback')}`)

module.exports = router
