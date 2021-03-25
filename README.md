# cdn-oss-upload

阿里云cdn


### example
* install & usage
```javascript

    npm i cdn-oss -g --registry http://xx.xx.xx.xx:4873

    cdn-oss start ./config.json
```
* config.json 
```javascript
    // object 
    {
        "output": "./dist",  // 所需上传cdn的目录
        "key": "media", //  上传cdn的key区分
        "accessKeyId": "LTAIXw2j3Vu2344444", // 上传的accessKeyId，非必传，程序默认有广东的accessKeyId
        "accessKeySecret": "OCqsDvZwfRQnhZyoNRA1233333333333", // 上传的accessKeySecret，非必传，accessKeyId配置时必传，程序默认有广东的accessKeySecret
        "bucket": "image/sitecdn/", // 上传的bucket，非必传，accessKeyId配置时必传，程序默认有广东的bucket
        "region": "oss-ap-northeast-1", // 上传地区，非必填，accessKeyId配置时必传，默认oss-cn-shenzhen
        "dstUrl": "https://domain/sitecdn/", // 非必传，accessKeyId配置时必传，上传的目标地址和访问地址前缀
        "tinify": true/false // 是否压缩jpeg/png
    }
```
or 
```javascript
//  array，会根据每个item多次上传
    [{
        "output": "./dist",  // 所需上传cdn的目录
        "key": "media", //  上传cdn的key区分
        "accessKeyId": "LTAIXw2j3Vu2344444", // 上传的accessKeyId，非必传，程序默认有广东的accessKeyId
        "accessKeySecret": "OCqsDvZwfRQnhZyoNRA1233333333333", // 上传的accessKeySecret，非必传，程序默认有广东的accessKeySecret
        "bucket": "image/sitecdn/", // 上传的bucket，非必传，accessKeyId配置时必传，程序默认有广东的bucket
        "region": "oss-cn-shenzhen", // 上传地区，非必传，accessKeyId配置时必传，默认oss-cn-shenzhen
        "dstUrl": "domain/sitecdn/", // 非必传，accessKeyId配置时必传，上传的目标地址和访问地址前缀
        "tinify": true/false // 非必填，是否压缩jpeg/png，默认false
    }, {
        "output": "./dist",  // 所需上传cdn的目录
        "key": "media", //  上传cdn的key区分
    }]
```
## API:

* start [configPath]

