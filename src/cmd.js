module.exports = {
    isCommand(url) {

        var split = url.split("/");
        try {
            if(split[1] == "cmd") return true;
        } catch(ignored) {}
        return false;

    },
    processCMD(full,ip) {

        var cmd = full.split(":")[0];
        var args = [];
        try { args = full.split(":")[1].split(","); } catch(ignored) {}

        try { 
            const result = commands[cmd](args,ip);
            if(result != null) {
                return (result + "");
            }
        } catch(e) {
            return ("An error occured while processing that command:\n\nCommand: " + cmd + "\nArgs: " + args.toString()+"\n\nError: " + e.message);
        }

        return ("Command sent!\n\nCommand: " + cmd + "\nArgs: " + args.toString());

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

        if(pass &&require("../src/users.js").indexOf(ip) == -1) require("../src/users.js").add(ip,{
            nickname: nickname,
            ip: [ip]
        });
        if(pass) require("../src/users.js").update(ip,{nickname:nickname});
        return pass;

    },
    nickname_get(args,ip) {

        const user = require("../src/users.js").get(args[0]);
        return user?.nickname ?? "Anonymous";

    },
    secret(args,ip) {
        
        const secret = args[0];
        for(const user of require("../src/users.js").getAll()) {
            if(user.secret == secret) return user;
        }
        return null;

    },

}
