const request = require('request')
const path = require('path')
const fs = require('fs')

function uploadFile(options) {
    const { 
        url,
        filePath,
        ossOptions
    } = options;
    return new Promise((resolve, reject) => {
        request({
            url,
            method: 'POST',
            formData: {
                ...ossOptions,
                file: fs.createReadStream(filePath)
            }
        }, function(err, res, body) {
            if (err) {
                console.log(err)
                reject(err)
            }
            console.log(filePath + ': ok')
            resolve()
        })
    })
    
}

export function uploadDir(args) {
    const { filePath, ossOptions: { key, ...rest } , url } = args;
    const list = walkDir(filePath);

    return Promise.all(list.map(fileName => uploadFile({
        url,
        filePath: fileName,
        ossOptions: {
            key: key + path.basename(fileName),
            ...rest
        },
    })))
}