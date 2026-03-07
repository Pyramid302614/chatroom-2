const http = require("http");
const fs = require("fs");
const ws = require("ws");

const CMD = require("../src/cmd.js");

process.addListener("uncaughtException",(e) => {
    console.error(e);
});
process.addListener("uncaughtRejection",(e) => {
    console.error(e);
});

function request(req,res,nested) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Command check
    if(CMD.isCommand(req.url)) {
        CMD.processCMD(req,res);
        return;
    }

    // Path Processing
    var path = "hosted";
    switch(req.url) {
        case "/":
            path += "/var/landing.html"; break;
        default:
            path += req.url; break;
    }

    // File Fetching
    fs.readFile(path,"utf-8",(err,data) => {

        var code = 200; // OK!
        var type;

        // Extension processing
        var ext = ".html";
        try {
            let ext_ = path.split(".");
            ext_ = ext_[ext_.length-1];
            ext = ext_; // Makes sure everythings finished before syncing
        } catch(ignored) {}
        switch(ext) {
            case "html": type = "text/html"; break;
            case "png": type = "image/png"; break;
            case "jpg": type = "image/jpg"; break;
            case "gif": type = "image/gif"; break;
            case "txt": type = "txt/plain"; break;
            case "css": type = "text/css"; break;
            case "json": type = "text/json"; break;
            case "js": type = "text/javascript"; break;
        }

        // Error filter
        if(err) 
            if(nested) {
                data = "Error 404 - Page not found";
                type = "text/plain";
                code = 404; // not OK!
            } else {
                // console.log("Error getting file: " + req.url + "\n" + err);
                req.url = "/var/404.html";
                request(req,res,true);
                return;
            }
        
        // Variables
       data = data.replaceAll("&&ip",req.socket.remoteAddress);
        if(["::1","98.160.191.168"].includes(req.socket.remoteAddress)) {
            data = data.replaceAll("pyshomecomputer.duckdns.org","localhost");
        }

        res.writeHead(code,{ "Content-Type": type });
        res.end(data);

    });

}

function server() {

    const server = http.createServer(request);
    const wss = new ws.Server({ server });

    wss.on("connection",(a,b) => require("./websocket.js").connection(a,b,wss));

    server.listen(3000,"0.0.0.0",() => {
        console.log("Listening on port 3000.\nhttp://localhost:3000/");
    });

}

module.exports = {
    request: request
};

server();