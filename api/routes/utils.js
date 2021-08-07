module.exports = {
  URLEncode (base, ...urls) {
    return urls.reduce(
      (urlBase, urlRoute) => URL(encodeURIComponent(urlRoute), urlBase),
      encodeURI(base)
    )
  },

  Serialize (obj) {
    const getParams = Object.entries(obj)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value.toString())}`)
      .join('&')

    return getParams ? `?${getParams}` : ''
  }
}
