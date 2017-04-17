const path = require("path");
const proxyquire = require("proxyquire");

const appRoot = path.resolve(__dirname, "..");

global.include = (path, dependencies) => {
    let modulePath = appRoot + "/" + path;

    if (!dependencies) {
        return require(modulePath);
    }
    else {
        return proxyquire(modulePath, dependencies);
    }
};