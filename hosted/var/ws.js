// Connect to websocket
console.log("Connecting to websocket...");
var ws = new WebSocket("ws://&&host:&&port");

// Configure websocket
function ws_config() {
    ws.onopen = async () => {
        console.log("Connected.");
        const nickname = await cmd("nickname_get");
        user = {
            nickname: nickname,
            ip: ip
        };
        console.log("Fetched user:\n"+JSON.stringify(user,null,2));
        document.getElementById("nicknamedisplay").innerHTML = user.nickname ?? "Anonymous";
    }
    ws.onmessage = async (event) => {
        const msg = await event.data.toString();
        if(logger) console.log("[LOGGER] WS In: " + msg);
        switch(event.data.split(":")[0]) {
            case "message":
                var aMsg = msg.slice(event.data.split(":")[0].length+1);
                simulate({
                    content: aMsg.split("&&&&")[0],
                    authorName: aMsg.split("&&&&")[2]
                });
                break;
            case "system":
                var aMsg = msg.slice(event.data.split(":")[0].length+1);
                system(aMsg);
                break;
            case "commandresponse":
                var aMsg = msg.slice(event.data.split(":")[0].length+1);
                wsIn(aMsg);
        }
    }
    ws.onclose = () => {
        console.log("Disconnected from websocket.");
        document.getElementById("content").innerHTML += "" +
        "<hr><span style=\"font-size:24px;\">Uh oh! You have been disconnected from the websocket!</span><br/>" +
        "<span style=\"font-size:12px;\">This could be because the server has stopped being hosted, or because you have been disconnected from the internet.</span>" +
        "<br\><br\><button onclick=\"location.reload();\">Reload Page</button>"+
        "&nbsp;|&nbsp;<button onclick=\"ws = new WebSocket('ws://&&host:&&port');;ws_config();\">Reconnect to websocket</button><hr>";
    }
}

ws_config();