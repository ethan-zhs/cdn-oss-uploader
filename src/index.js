const path = require('path')
const fs = require('fs')
const request = require('request')
const uploadManager = require('./getOssHeader')
const progressBar = require('progress')

let output = path.resolve(__dirname);
let key = '';

function walkDir(dir) {
    const fileList = [];
    function walk(dir) {
        const dirPath = path.resolve(dir);
        const list = fs.readdirSync(dirPath);
        list.map(item => {
            const itemPath = path.join(dirPath + '/' + item)
            if (fs.statSync(itemPath).isDirectory()) {
                walk(itemPath)
            } else {
                fileList.push(itemPath)
            }
        })
    }
    walk(dir)
    // console.log(fileList)
    return fileList;
}

function processFileInfo(fileList) {
    if (!fileList || !fileList.length) {
        return []
    }
    const res = fileList.map(item => {
        const data = {
            path: item,
            key: path.normalize(path.relative(output, item))
        }
        return data
    })
    // console.log(res)
    return res
}

function run(config) {
    output = config.output
    key = config.key
    const jobs = processFileInfo(walkDir(output))
    const length = jobs.length
    let i = 0
    const bar = new progressBar(' uploading [:bar] :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 40,
        total: length
    });
    return Promise.all(jobs
        .map(item => uploadManager(item, key, config.tinify, config)
        .then(() => {
            i++
            bar.tick();
            if (bar.complete) {
                console.log('\ncomplete\n');
            }
        })
        .catch(function(err) { 
            // ignore err on here 
            return Promise.resolve()  
        })
    ))
}

module.exports = run
