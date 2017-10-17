const cheerio = require('cheerio')
const request = require('request-promise')
const { parse: parseUrl, URL } = require('url')

module.exports = async (req, res) => {
    const siteUrl = parseUrl(req.url, true).query.url
    res.setHeader('Access-Control-Allow-Origin', '*')

    if (!siteUrl) {
        return {
            error: '`url` search query parameter is required.'
        }
    }

    const html = await request(siteUrl)
    const $ = cheerio.load(html)
    const manifestHref = $('link[rel="manifest"]').attr('href')

    if (!manifestHref) {
        return {
            error: 'Provided webpage (`url`) has no web app manifest.'
        }
    }

    const manifestUrl = (new URL(manifestHref, siteUrl)).href
    const manifestContent = await request(manifestUrl)
    const manifest = JSON.parse(manifestContent)

    return {
        manifest
    }
}
