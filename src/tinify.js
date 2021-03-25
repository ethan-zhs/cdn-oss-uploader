const path = require('path');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

function tinify(fileData, quality) {
    return new Promise((resolve, reject) => {
        imagemin.buffer(fileData, {
            plugins: [
                imageminMozjpeg(),
                imageminPngquant({quality: quality || '70-80'})
            ]
        }).then(file => {
            console.log('\n')
            console.log('compress: ', fileData.length, file.length)
            //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …] 
            resolve(file)
        }).catch(err => {
            reject(err)
        })
    })
}

module.exports = tinify
