const commands = []; // cmd.js

function newCID() {
    for(const command of commands) {
        var cid = Math.floor(Math.random()*10000);
        if(command.cid != cid) return cid;
    }
    return 0;
}

function wsIn(msg) {

    const cid = msg.split("&&&&")[1];
    for(var i = 0; i < commands.length; i++) {
        const command = commands[i];
        if(command.cid == cid) {
            command.resolve();
            command.return = msg.split("&&&&")[0];
        }
    }

}

async function cmd(name,args) {

    // Nullish checking
    if(!name) return;
    args = args ?? [];
    if(typeof args != "object") args = [args];
    
    // Arguments String to send to WS
    var argsString = "";
    for(const arg of args) {
        argsString += "," + arg;
    }
    argsString = argsString.slice(1);

    // CID generation
    const cid = newCID();

    // Object generation
    const obj = {
        cid: cid,
        name: name,
        args: args
    }

    // Wait for WS to be open
    if(ws.readyState == 1) await new Promise(resolve =>
        setInterval(() => {
            if(ws.readyState == 1) resolve();
        }, 1000)
    );

    // Waiting (Temporary hibernation kinda)
    await new Promise(resolve => {
        
        // Command object push
        obj.resolve = resolve;
        commands.push(obj);

        // WS Message
        const msg = "command:"+name+":"+argsString+":"+cid;
        WSsend(msg);

    });
    // Removes from array
    commands.splice(commands.indexOf(obj),1);

    // Returns once promise resolves
    return obj.return.split("&&&&")[0];

}