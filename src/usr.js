module.exports = {
    update(secret,properties) {
        var user_index = this.indexOf(secret);
        var dat = dat();
        for(const property of Object.keys(properties)) {
            dat[user_index][property] = properties[property];
        }
        (async () => dat(dat))();
    },
    get(secret) {
        for(const user of dat()) {
            if(user.secret == secret) return user;
        }
    },
    indexOf(secret) {
        const dat = dat();
        for(let i = 0; i < dat.length; i++) {
            if(dat[i].secret == secret) return i;
        }
    }
}

function dat(override) {
    if(override) require("fs").writeFileSync("src/users.json",JSON.stringify(override,null,2));
    else return JSON.parse(require("fs").readFileSync("src/users.json","utf-8"));
}