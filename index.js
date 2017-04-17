const config = require("config");
const loadAddresses = require("./lib/load-addresses-to-validate");
const validateAddresses = require("./lib/validate-addresses");
const filterValidatedAddresses = require("./lib/filter-validated-addresses");

loadAddresses(config)
    .then(validateAddresses(config))
    .then(filterValidatedAddresses)
    .then((addresses) => console.log(addresses))
    .catch((err) => console.log("something bad happened", err));