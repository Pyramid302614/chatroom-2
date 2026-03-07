module.exports = {
    isCommand(url) {

        var split = url.split("/");
        try {
            if(split[1] == "cmd") return true;
        } catch(ignored) {}
        return false;

    },
    processCMD(req,res) {
        
        const ip = req.socket.remoteAddress;
        const url = req.url;

        var cmd = url.split("/")[2];
        var args = [];
        try { args = url.split("/")[3].split(","); } catch(ignored) {}

        try { 
            const result = commands[cmd](args,ip);
            if(result != null) {
                res.writeHead(200,{ "Content-Type": "text/plain" });
                res.end(result + "");
                return;
            }
        } catch(e) {
            res.writeHead(200,{ "Content-Type": "text/plain" });
            res.end("An error occured while processing that command:\n\nCommand: " + cmd + "\nArgs: " + args.toString()+"\n\nError: " + e.message);
            return;
        }

        res.writeHead(200,{ "Content-Type": "text/plain" });
        res.end("Command sent!\n\nCommand: " + cmd + "\nArgs: " + args.toString());

    }
}

const commands = {
    
    users_add(args,ip) {

        require("../src/users.js").add(ip,{});

    },
    // users_update(args,ip) {

    //     var properties = {};
    //     for(const arg of args) {
    //         properties[arg.split(":")[0]] = arg.split(":")[1];
    //     }
    //     require("../src/users.js").update(ip,properties);

    // },
    nickname_update(args,ip) {

        const nickname = args[0];
    
        pass = true;
        for(const user_ of require("../src/users.js").getAll()) {
            if(user_.nickname == nickname) pass = false;
        }

        if(require("../src/users.js").indexOf(ip) == -1) require("../src/users.js").add(ip,{
            nickname: nickname,
            ip: ip
        });
        if(pass) require("../src/users.js").update(ip,{nickname:nickname});
        return true;

    },
    nickname_get(args,ip) {

        return require("../src/users.js").get(ip).nickname;

    }

}