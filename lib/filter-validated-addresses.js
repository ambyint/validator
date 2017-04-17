module.exports = (responses) => {
    // console.log("filtering addresses");
    let addresses = [];

    responses.forEach((response) => {
        if(response.status === "OK"){
            for(let i = 0; response.results.length; i++){
                const result = response.results[i];

                if(!result || result.geometry.location_type !== "ROOFTOP") break;

                addresses.push(result.formatted_address);
            }
        }
    });

    return Promise.resolve(addresses);
};