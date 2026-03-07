var user = {};

// Variables
var ip = "&&ip";

// Connect to websocket
console.log("Connecting to websocket...");
const ws = new WebSocket("ws://pyshomecomputer.duckdns.org:3000");
// Configure websocket
ws.onopen = () => console.log("Connected.");
ws.onmessage = async (event) => {
    const msg = await event.data.toString();
    console.log(msg);
    switch(event.data.split(":")[0]) {
        case "message":
            var aMsg = msg.slice(event.data.split(":")[0].length+1);
            simulate({
                content: aMsg.split("&&&&")[0],
                authorName: aMsg.split("&&&&")[1]
            });
            break;
        case "system":
            var aMsg = msg.slice(event.data.split(":")[0].length+1);
            system(aMsg);
            break;
    }
}
ws.onclose = () => console.log("Disconnected from websocket.");

function sendButton() {
    const content = document.getElementById("textbox").value;
    document.getElementById("textbox").value = "";
    send({
        content: content
    });
}

function send(msg) {

    ws.send("message:"+msg.content);
    // simulate(msg,user.nickname);
    
}

function simulate(msg) {
    
    document.getElementById("content").innerHTML += `${msg.authorName??"Anonymous"} >> ${msg.content}<br/>`;
    
}

function system(msg) {
    document.getElementById("content").innerHTML += msg + "<br/>";
    
}


async function nicknameSubmitButton() {
    
    const pass = await (await fetch("http://pyshomecomputer.duckdns.org:3000/cmd/nickname_update/"+document.getElementById("nicknamebox").value)).text();

    if(pass == "true") {
        const nickname = document.getElementById("nicknamebox").value;
        document.getElementById("nicknamebox").value = "";
        user.nickname = nickname;
        document.getElementById("nicknamedisplay").innerHTML = nickname;
        
    } else {
        document.getElementById("nicknamebox").backgroundColor = "rgba(255,0,0,100);";
    }

}

window.addEventListener("DOMContentLoaded",() => {

    // Event listeners
    document.getElementById("sendbutton").addEventListener("click",sendButton);
    document.getElementById("textbox").addEventListener("keydown",(e) => {
        if(e.keyCode == 13) sendButton();
    });
    document.getElementById("nicknamesubmitbutton").addEventListener("click",nicknameSubmitButton);
    document.getElementById("nicknamebox").addEventListener("keydown",(e) => {
        if(e.keyCode == 13) nicknameSubmitButton();
    });
    
    // Fetch user
    var e = async () => {
        const n = await (await fetch("http://pyshomecomputer.duckdns.org:3000/cmd/nickname_get")).text();
        user = {
            nickname: n,
            ip: ip
        };
        document.getElementById("nicknamedisplay").innerHTML = user.nickname ?? "Anonymous";
    };
    e();
    
});

document.getElementById("content").innerHTML = "";