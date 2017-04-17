const async = require("async");
const googleMaps = require("@google/maps");

module.exports = (options) => {
    return (addresses) => {
        const client = googleMaps.createClient({ key: options.googleApiKey});

        return new Promise((resolve, reject) => {
            // console.log("validating");
            let validatedAddresses = [];
            async.whilst(
                () => addresses.length > 0,
                (next) => {
                    const set = addresses.splice(0, options.messagesPerSecond || 1);

                    const tasks = set.map((address) => (callback) => {
                        client.geocode({address: address}, (err, response) => {
                            if(err) return callback(err);
                            return callback(null, response.json);
                        })
                    });

                    async.parallel(tasks, (err, results) => {
                        if (err) return next(err);

                        validatedAddresses.push(...results);
                        setTimeout(next, 1000);
                    });
                },
                (err) => {
                    if (err) return reject(err);
                    resolve(validatedAddresses);
                }
            );
        });
    };
};