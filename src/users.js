const fs = require("fs");

module.exports = {
    add(ip,user) {
        if(this.get(ip)) {
            this.update(ip,user);
            return;
        }
        const users = JSON.parse(fs.readFileSync("src/users.json","utf-8"));
        user.ip = ip;
        users.push(user);
        fs.writeFile("src/users.json",JSON.stringify(users,null,2),"utf-8",()=>{});
    },
    update(ip,properties) {
        const users = JSON.parse(fs.readFileSync("src/users.json","utf-8"));
        const userIndex = this.indexOf(ip);
        for(const property of Object.keys(properties)) {
            users[Object.keys(users)[userIndex]][property] = properties[property];
        }
        fs.writeFile("src/users.json",JSON.stringify(users,null,2),"utf-8",()=>{});
    },
    get(ip) {
        const users = JSON.parse(fs.readFileSync("src/users.json","utf-8"));
        for(const user of users)
            if(user.ip == ip) return user;
        return null;
    },
    indexOf(ip) {
        const users = JSON.parse(fs.readFileSync("src/users.json","utf-8"));
        for(var i = 0; i < users.length; i++) {
            var user = users[Object.keys(users)[i]];
            if(user.ip == ip) return i;
        }
        return -1;
    },
    getAll() {
        return JSON.parse(fs.readFileSync("src/users.json","utf-8"));
    }
}