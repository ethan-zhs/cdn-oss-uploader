const crypto = require('crypto')
const mime = require('mime')
const is = require('is-type-of')
const dateFormat = require('dateformat')
const fs = require('fs')
const request = require('request')
const tinify = require('./tinify')

const initOSS = {
    accessKeyId: 'LTAIXw2j3Vu2344444',
    accessKeySecret: 'OCqsDvZwfRQnhZyoNRA1233333333333',
    bucket: 'image/sitecdn/',
    key: 'event',
    region: 'oss-cn-shenzhen',
    dstUrl: 'http://domain/sitecdn/'
}

let OSS = Object.assign({}, initOSS)

function mergeConfig(config = {}) {
    OSS = Object.assign({}, initOSS, config)
}

function getHeader(params) {
    //var userAgent = this.getUserAgent();
    var headers = {
        'x-oss-date': dateFormat(new Date().getTime(), 'UTC:ddd, dd mmm yyyy HH:MM:ss \'GMT\'')
    };

    headers['Content-Type'] = params.mime || 'application/x-www-form-urlencoded';

    if (params.content) {
        headers['Content-Md5'] = crypto
        .createHash('md5')
        .update(new Buffer(params.content, 'utf8'))
        .digest('base64');
    }

    var authResource = getResource(params);
    headers.authorization = authorization(params.method, authResource, params.subres, headers);
    return headers;

}

function authorization(method, resource, subres, headers) {
    var params = [
        method.toUpperCase(),
        headers['Content-Md5'] || '',
        headers['Content-Type'] || '',
        headers['x-oss-date']
    ];

    var ossHeaders = {};
    for (var key in headers) {
        var lkey = key.toLowerCase().trim();
        if (lkey.indexOf('x-oss-') === 0) {
            ossHeaders[lkey] = ossHeaders[lkey] || [];
            ossHeaders[lkey].push(String(headers[key]).trim());
        }
    }

    var ossHeadersList = [];
    Object.keys(ossHeaders).sort().forEach(function (key) {
        ossHeadersList.push(key + ':' + ossHeaders[key].join(','));
    });

    params = params.concat(ossHeadersList);
    var resourceStr = '';
    resourceStr += resource;

    var subresList = [];
    if (subres) {
        if (is.string(subres)) {
            subresList.push(subres);
        } else if (is.array(subres)) {
            subresList = subresList.concat(subres);
        } else {
            for (var k in subres) {
                var item = subres[k] ? k + '=' + subres[k] : k;
                subresList.push(item);
            }
        }
    }

    if (subresList.length > 0) {
        resourceStr += '?' + subresList.join('&');
    }

    params.push(resourceStr);
    var stringToSign = params.join('\n');
    var auth = 'OSS ' + OSS.accessKeyId + ':';
    return auth + signature(stringToSign);

}

function signature(stringToSign) {
    var signature = crypto.createHmac('sha1', OSS.accessKeySecret);
    signature = signature.update(new Buffer(stringToSign, 'utf8')).digest('base64');
    return signature;
}

function getResource(params) {
    var resource = '/';
    resource += OSS.bucket + OSS.key + '/';
    if (params.object) resource += params.object
    return resource;
}

function getUrl(options) {
    var resourceStr = '';
    var subresList = [];
    if (options.subres) {
        if (is.string(options.subres)) {
            subresList.push(options.subres);
        } else if (is.array(options.subres)) {
            subresList = subresList.concat(options.subres);
        } else {
            for (var k in options.subres) {
                var item = options.subres[k] ? k + '=' + options.subres[k] : k;
                subresList.push(item);
            }
        }
    }

    if (subresList.length > 0) {
        resourceStr += '?' + subresList.join('&');
    }
    // console.log(OSS.dstUrl + OSS.key + '/' + options.object + resourceStr)
    return OSS.dstUrl + OSS.key + '/' + options.object + resourceStr;
}


function uploadFile(fileInfo, OSSkey, willTinify, config) {
    config && mergeConfig(config)
    OSS.key = OSSkey
    const { key, path } = fileInfo;
    const ossData = {
        object: key.replace(/\\/g, '/'),
        method: 'PUT',
        steam: fs.createReadStream(path),
        mime: mime.getType(path)
    }

    const url = getUrl(ossData);
    const headers = getHeader(ossData);
    if (willTinify) {
        return new Promise((resolve, reject) => {
            tinify(fs.readFileSync(path)).then(data => {
                request({
                    url,
                    method: ossData.method,
                    headers,
                    body: data
                }, function(err, res, body) {
                    if (err) {
                        // console.log(err, body)
                        console.log('\n' + path + ': error')
                        reject(err)
                    }
                    // console.log(body)
                    // console.log('\n' + path + ': ok')
                    // console.log(url)
                    resolve(url)
                })
            }).catch(function(err) {
                console.log('\n' + path + ' compress error:', err)
            })
        })
    }
    return new Promise((resolve, reject) => {
        fs.createReadStream(path).pipe(
            request({
                url,
                method: ossData.method,
                headers
            }, function(err, res, body) {
                if (err) {
                    // console.log('with error', err, body)
                    console.log('\n' + path + ': error')
                    reject(err)
                }
                // console.log(res)
                // console.log('\n' + path + ': ok')
                resolve(url)
            })
        )
    })
}

module.exports = uploadFile
