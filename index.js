const pkg = require('./package')
const cheerio = require('cheerio')
const request = require('request-promise')
const { parse: parseUrl, URL } = require('url')
const { send } = require('micro')

function missingParameterError (parameter, type = 'query') {
    return {
        code: 'MISSING_PARAMETER',
        parameter,
        message: `'${parameter}' ${type} parameter is required.`,
        docs: `${pkg.homepage}#parameters`
    }
}

module.exports = async (req, res) => {
    const siteUrl = parseUrl(req.url, true).query.url
    res.setHeader('Access-Control-Allow-Origin', '*')
    const errors = []

    if (!siteUrl) {
        errors.push(missingParameterError('url'))
    }
    if (errors.length > 0) {
        return send(res, 400, { errors })
    }

    let html
    try {
        html = await request(siteUrl)
    } catch (err) {
        return send(res, 500, { errors: [
            { 
                code: 'FETCH_ERROR', 
                message: `Unable to fetch webpage from '${siteUrl}'`
            }
        ]})
    }

    const $ = cheerio.load(html)
    const manifestHref = $('link[rel="manifest"]').attr('href')

    if (!manifestHref) {
        return send(res, 404, { errors: [
            { 
                code: 'MISSING_MANIFEST', 
                message: `'${siteUrl}' has no web app manifest.`
            }
        ]})
    }

    const manifestUrl = (new URL(manifestHref, siteUrl)).href
    let manifestContent
    try {
        manifestContent = await request(manifestUrl)
    } catch (err) {
        return send(res, 500, { errors: [
            { 
                code: 'FETCH_ERROR', 
                message: `Unable to fetch web app manifest from '${manifestUrl}'`
            }
        ]})
    }

    let manifest
    try {
        manifest = JSON.parse(manifestContent)
    } catch (err) {
        return send(res, 500, { errors: [
            { 
                code: 'INVALID_MANIFEST', 
                message: `'${manifestUrl}' is not a valid web app manifest.`
            }
        ]})
    }

    return {
        manifestUrl,
        manifest
    }
}
