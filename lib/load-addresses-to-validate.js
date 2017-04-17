const fs = require("fs");
const readline = require("readline");

function cleanseAddress(data) {
    if (!data) return;
    return data.replace(/"/g, "").replace(/ /g, "+");
}

module.exports = (options) => {
    return new Promise((resolve) => {
        // console.log("loading addresses");
        let addressesToValidate = [];
        let rowCount = 0;

        let reader = readline.createInterface({
            input: fs.createReadStream(options.filename)
        });

        reader
            .on("line", (line) => {
                if (rowCount > 0 || !options.containsHeader) {
                    addressesToValidate.push(cleanseAddress(line));
                }
                rowCount++;
            })
            .on("close", () => resolve(addressesToValidate))
        ;
    });
};