var jwt = require("jsonwebtoken");
var config = require("config");

var generateJwtToken = (data) => {
    var token = jwt.sign(data, config.project.jwtSecret, { expiresIn: "1d" });
    return token;
};

var verifyJwtToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.project.jwtSecret, function (err, decoded) {
            if (err) {
                reject(err);
            }
            resolve(decoded);
        });
    });
};

var getConectionString = () => {
    var connStr = "";
    //mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
    var userOption = "";
    if (config.database.username) {
        userOption =
            config.database.username + ":" + config.database.password + "@";
    }

    connStr =
        "mongodb+srv://" +
        userOption +
        config.database.host +
        "/" +
        config.database.database +
        "?retryWrites=true&w=majority";
    // "mongodb://" +
    // userOption +
    // config.database.host +
    // ":" +
    // config.database.port +
    // "/" +
    // config.database.database;
    console.log(connStr);
    return connStr;
};

module.exports = {
    generateJwtToken,
    verifyJwtToken,
    getConectionString,
};
