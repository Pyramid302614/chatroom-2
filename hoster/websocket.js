module.exports = {
    connection(ws,req,wss) {

        var sendAll = (msg) => {
            wss.clients.forEach((client) => {
                    if(client.readyState == WebSocket.OPEN) client.send(msg);
            });
        }

        // System join message
        const user = require("../src/users.js").get(req.socket.remoteAddress) ?? {};
        sendAll("system:" + (user.nickname??"Anonymous") + " joined.");
        
        

        var lastReqTimestamp = 0;
        var reqSpamWarnings = 0;
        var reqTimeoutTimestamp = 0;

        ws.on("message",async (event) => {

            const msg = event.toString();

            if(Date.now() - lastReqTimestamp < 1000) reqSpamWarnings++; else if(reqSpamWarnings != 0) reqSpamWarnings--;
            let timeoutAmount = 10000;
            if(Date.now() - reqTimeoutTimestamp < timeoutAmount) {
                if(msg.split(":")[0] == "message") ws.send("system:You cannot send that message; You are timed out. (Remaining seconds: " + Math.floor(timeoutAmount/1000-(Date.now()-reqTimeoutTimestamp)/1000)+")");
                return;
            }
            if(reqSpamWarnings > 10) {
                if(msg.split(":")[0] == "message") ws.send("system:You have been sent too many messages. Spamming isn't funny, shut up");
                reqTimeoutTimestamp = Date.now();
                console.log("IP has been timed out: " + req.socket.remoteAddress);
                return;
            }
            lastReqTimestamp = Date.now();

            switch(msg.split(":")[0]) {
            case "message":

                const user = require("../src/users.js").get(req.socket.remoteAddress) ?? {};
                const nick = user.nickname ?? "Anonymous";
                sendAll(msg+"&&&&"+nick);
                break;
                
            case "command":
                const CMD = require("../src/cmd.js");
                const cmd = msg.split(":")[1]+":"+msg.split(":")[2];
                ws.send("commandresponse:"+CMD.processCMD(cmd,req.socket.remoteAddress)+"&&&&"+msg.split(":")[3]);
                break;
            case "admin_sysmsg":
                if(msg.split(":")[1] == "py") {
                    sendAll("system:"+msg.split(":")[2]);
                } 
        }

        });
        ws.on("close",() => {

            const user = require("../src/users.js").get(req.socket.remoteAddress) ?? {};
            sendAll("system:" + (user.nickname??"Anonymous") + " left.");
        
        });

    }
}