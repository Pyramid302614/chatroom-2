module.exports = {
    connection(ws,req,wss) {

        console.log("User connecting to websocket: " + req.socket.remoteAddress);

        wss.clients.forEach((client) => {
            if(client.readyState == WebSocket.OPEN) {
                const user = require("../src/users.js").get(req.socket.remoteAddress) ?? {};
                client.send("system:<b>" + (user.nickname??"Anonymous") + " joined.</b>");
            }
        });

        ws.on("message",async (event) => {

            const msg = event.toString();

            if(msg.split(":")[0] == "message") {
                wss.clients.forEach((client) => {
                    if(client.readyState == WebSocket.OPEN) {
                        const user = require("../src/users.js").get(req.socket.remoteAddress) ?? {};
                        const nick = user.nickname ?? "Anonymous";
                        client.send(msg+"&&&&"+nick);
                    }
                });
            }

        });
        ws.on("close",() => {

            wss.clients.forEach((client) => {
                if(client.readyState == WebSocket.OPEN) {
                    const user = require("../src/users.js").get(req.socket.remoteAddress) ?? {};
                    client.send("system:<b>" + (user.nickname??"Anonymous") + " left.</b>");
                }
            });

        });

    }
}