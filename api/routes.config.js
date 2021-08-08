require('dotenv').config()
const ENV = process.env

const API_BASE = `${ENV.VUE_APP_API_URI}:${ENV.VUE_APP_API_PORT}`
const VUE_BASE = `${ENV.VUE_APP_URI}:${ENV.VUE_APP_PORT}`

const ROUTES = {
  oauth: {
    _: 'oauth2.0',
    discord: {
      _: 'discord',
      tokenIssuing: 'auth',
      tokenCallback: 'token',
      userInfo: 'info'
    }
  },
  discord: 'discord'
}

function getURL (routeName, urlType) {
  try {
    if (!urlType || urlType === 'tail') {
      let route = ROUTES
      let lastRoute
      for (const currRoute of routeName.split('.')) {
        lastRoute = currRoute
        route = route[currRoute]
      }
      return '/' + (route._ || (typeof route === 'string' ? route : lastRoute))
    } else {
      const route = routeName.split('.').reduce(([url, route], curr) => {
        const currURL = route[curr]._ || (typeof route[curr] === 'string' ? route[curr] : curr)
        return [url + '/' + currURL, route[curr]]
      }, [ENV.VUE_APP_API_ROUTE, ROUTES])[0]

      if (urlType === 'full') {
        return API_BASE + route
      } else {
        return route
      }
    }
  } catch (err) {
    if (process.env.DEBUG) {
      console.log(`\x1b[31m[DEBUG] - Error: getURL('${routeName}') - Route '${routeName}' is not defined.\x1b[0m\n`)
      return ENV.VUE_APP_404
    } else {
      throw err
    }
  }
}

module.exports = { ENV, API_BASE, VUE_BASE, ROUTES, getURL }
