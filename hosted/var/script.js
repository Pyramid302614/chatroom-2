var user = {};

var logger = false;

// Variables
var ip = "&&ip";


function sendButton() {
    const content = document.getElementById("textbox").value;
    document.getElementById("textbox").value = "";
    send({
        content: content
    });
}

function send(msg) {

    WSsend("message:"+msg.content);
    // simulate(msg,user.nickname);
    
}

function WSsend(msg) {

    if(logger) console.log("[LOGGER] Out: " + msg);
    ws.send(msg);

}

function simulate(msg) {

    document.getElementById("content").innerHTML += `${msg.authorName??"Anonymous"} >> ${msg.content}<br/>`;
    
}

function system(msg) {
    document.getElementById("content").innerHTML += "<b>" + msg + "</b><br/>";
    
}


async function nicknameSubmitButton() {
    
    const pass = cmd("nickname_set",document.getElementById("nicknamebox").value);

    if(pass == "true") {
        const nickname = document.getElementById("nicknamebox").value;
        document.getElementById("nicknamebox").value = "";
        user.nickname = nickname;
        document.getElementById("nicknamedisplay").innerHTML = nickname;
        
    } else {
        document.getElementById("nicknamebox").style.backgroundColor = "rgba(255,0,0,0.5)";
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
        document.getElementById("nicknamebox").style.background = "none";
        if(e.keyCode == 13) nicknameSubmitButton();
    });
    
});

document.getElementById("content").innerHTML = "";