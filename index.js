const cheerio = require('cheerio')
const request = require('request-promise')
const { parse: parseUrl, URL } = require('url')

module.exports = async (req, res) => {
    const siteUrl = parseUrl(req.url, true).query.url
    res.setHeader('Access-Control-Allow-Origin', '*')

    if (!siteUrl) {
        return { error: '`url` search query parameter is required.' }
    }

    let html
    try {
        html = await request(siteUrl)
    } catch (err) {
        return { error: `Unable to fetch webpage from '${siteUrl}'` }
    }

    const $ = cheerio.load(html)
    const manifestHref = $('link[rel="manifest"]').attr('href')

    if (!manifestHref) {
        return { error: `'${siteUrl}' has no web app manifest.` }
    }

    const manifestUrl = (new URL(manifestHref, siteUrl)).href
    let manifestContent
    try {
        manifestContent = await request(manifestUrl)
    } catch (err) {
        return { error: `Unable to fetch web app manifest from '${manifestUrl}'` }
    }

    let manifest
    try {
        manifest = JSON.parse(manifestContent)
    } catch (err) {
        return { error: `'${manifestUrl}' is not a valid web app manifest.` }
    }

    return {
        manifest
    }
}
