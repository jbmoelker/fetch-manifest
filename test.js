const micro = require('micro')
const test = require('ava')
const listen = require('test-listen')
const request = require('request-promise')
const { parse: parseUrl } = require('url')

const fetchManifest = require('./')

test('returns manifest of web page', async t => {
    // setup mock site with manifest to use the service on:
    const mockSite = micro(async (req, res) => {
        const manifestUrl = '/manifest-mock.json'
        if (req.url === '/') {
            res.setHeader('Content-Type', 'text/html')
            return micro.send(res, 200, `<link rel="manifest" href="${manifestUrl}">`)
        }
        if (req.url === manifestUrl) {
            return micro.send(res, 200, { name: 'mock manifest' })
        }
    })
    const mockSiteUrl = await listen(mockSite)

    // use service on mock site:
    const service = micro(fetchManifest)
    const url = await listen(service)
    const body = await request(`${url}/?url=${mockSiteUrl}`)
    const data = JSON.parse(body)

    // assert service response:
    t.deepEqual(parseUrl(data.manifestUrl).pathname, '/manifest-mock.json')
    t.deepEqual(data.manifest, { name: 'mock manifest' })

    // clean up:
    mockSite.close()
    service.close()
})

test('returns 404 if site has no manifest', async t => {
    // setup mock site to use the service on:
    const mockSite = micro(async (req, res) => micro.send(res, 200, {}))
    const mockSiteUrl = await listen(mockSite)

    // use service on mock site:
    const service = micro(fetchManifest)
    const url = await listen(service)
    const response = await request({
        method: 'GET',
        uri: `${url}/?url=${mockSiteUrl}`,
        resolveWithFullResponse: true,
        simple: false,
    })
    const { errors } = JSON.parse(response.body)

    // assert service response:
    t.deepEqual(response.statusCode, 404)
    t.deepEqual(errors[0].code, 'MISSING_MANIFEST')

    // clean up:
    mockSite.close()
    service.close()
})

test('returns 405 if not a GET request', async t => {
    // setup mock site to use the service on:
    const mockSite = micro(async (req, res) => micro.send(res, 200, {}))
    const mockSiteUrl = await listen(mockSite)

    // use service on mock site:
    const service = micro(fetchManifest)
    const url = await listen(service)
    const response = await request({
        method: 'DELETE',
        uri: `${url}/?url=${mockSiteUrl}`,
        resolveWithFullResponse: true,
        simple: false,
    })
    const { errors } = JSON.parse(response.body)

    // assert service response:
    t.deepEqual(response.statusCode, 405)
    t.deepEqual(errors[0].code, 'METHOD_NOT_ALLOWED')

    // clean up:
    mockSite.close()
    service.close()
})
