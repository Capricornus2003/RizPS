/*
如果你把ssl证书弄丢了，在拥有openssl可执行文件的前提下可以使用下面的命令重新生成一个：
openssl genrsa -out server.key 2048
openssl req -new -key server.key -out server.csr
openssl x509 -req -days 114514 -in server.csr -signkey server.key -out server.crt
*/

const https = require("https");
const express = require('express');
const fs = require('fs');
const app = express();

const express_options = {
    setHeaders (res, path, stat) {
    res.set('Content-Type', "application/json")
    res.set('Access-Control-Allow-Origin', "*")
    }
}//设置headers

app.use(express.static('public', express_options))

const host = "0.0.0.0"//对外ip 当然首选0.0.0.0
const port = 1244;//对外端口号 直接443 省事
const loglevel = 1//0表示显示全log，1表示精简显示log
const options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt')
};//设置证书文件

const server = https.createServer(options,app);
server.listen(port, host, () => {
    console.log(`server address: https://${host}:${port}`);
});

server.on("data",function(){
    console.log("data")
})
server.on("connect",function(){
    console.log("connect")
})
server.on("error",function(){
    console.log("error")
})

app.all('/', (req, res) => {
        console.log("客户端向 / 发送GET请求")
        res.send("欢迎来到RizPS！")
    }
);

app.all('/sync_data', (req, res) => {
        let req_datas = ""
        req.on('data', function (chunk) {
            req_datas += chunk;
        });
        req.on('end', function () {
            req_datas = decodeURIComponent(req_datas)
            console.log("客户端向 /sync_data 发送POST请求 内容为：\n" + "-----------\n" + req_datas.toString() + "\n----------")
            res.send("{\"code\":0}")
        })
    }
);

const static_inhans = fs.readFileSync("./static_contents/initget_zhans.txt").toString()
const static_inhk = fs.readFileSync("./static_contents/initget_zhk.txt").toString()

app.all('/elva/api/v2.0/initget', (req, res) => {
    console.log("客户端向 /elva/api/v2.0/initget 发送GET请求")
    if(req.url.search("zh-Hans-CN") != -1){
        res.send("{\"flag\":true,\"code\":200,\"message\":\"Success\",\"time\":" + Date.now() + "," + static_inhans)
    }
    else if(req.url.search("zh-HK") != -1){
        res.send("{\"flag\":true,\"code\":200,\"message\":\"Success\",\"time\":" + Date.now() + "," + static_inhk)
    }
    else{
        res.send("无法解析的请求")
    }
}
);

app.post("/login/sdkCheckLogin.do", (req, res) => {
    let req_datas = ""
    req.on('data', function (chunk) {
        req_datas += chunk;
    });
    req.on('end', function () {
        req_datas = req_datas.split("&")
        console.log(req_datas[0] + "的用户正在使用" + req_datas[3] + "尝试登陆")
        let resend = "{\"message\":\"{\\\"timestamp\\\":\\\"" + Date.now() + "\\\",\\\"warnEndDate\\\":null,\\\"token\\\":\\\"" + req_datas[3].split("=")[1] + "\\\",\\\"priority\\\":3,\\\"cmtBirth\\\":\\\"3\\\",\\\"bind\\\":\\\"9\\\"}\",\"status\":\"1\"}"
        console.log(resend)
        res.send(resend)
    });
})

const st_41_20190403json = fs.readFileSync("./static_contents/410001_config_20190403.json").toString()

app.all("/67/410001_config_20190403.json", (req, res) => {
    res.send(st_41_20190403json)
})

const st_lg = fs.readFileSync("./static_contents/languageConfig.json").toString()

app.all("/language/languageConfig.json", (req, res) => {
    res.send(st_lg)
})

app.all("/testasset/iOS/catalog_catalog.hash", (req, res) => {
    res.send("da3a0df9301dee0c6dce203f434d7220")
})

const stv11_faef = fs.readFileSync("./static_contents/facebook_app_events_feature_bitmask.json").toString()
const stv11_faec = fs.readFileSync("./static_contents/facebook_app_events_config.json").toString()

app.all("/v11.0/493960762698668", (req, res) => {
    if(req.url.search("app_events_feature_bitmask") != -1){
        res.send(stv11_faef)
    }
    else if(req.url.search("app_events_config") != -1){
        res.send(stv11_faec)
    }
})

const st_fb_msdkgk = fs.readFileSync("./static_contents/facebook_mobile_sdk_gk.json").toString()

app.all("/v11.0/493960762698668/mobile_sdk_gk", (req, res) => {
    res.send(st_fb_msdkgk)
})

app.all("/v11.0/493960762698668/ios_skadnetwork_conversion_config", (req, res) => {
    res.send("{\"data\":[]}")
})

app.all("/v11.0/493960762698668/aem_conversion_configs", (req, res) => {
    res.send("{\"data\":[]}")
})

app.all("/elva/api/SdkTrack/ExceptionTrack", (req, res) => {
    res.send("{\"flag\":true,\"code\":0,\"desc\":\"\",\"time\":" + Date.now() + ",\"data\":false}")
})

app.all("/api/v1.0/rules", (req, res) => {
    res.send("{\"message\":\"invalid signature\"}")
})

app.all("/log/chargeLogReport.do", (req, res) => {
    res.send("success")
})