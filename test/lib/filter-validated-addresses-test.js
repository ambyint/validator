describe(__filename, () => {
    let sut, googleResponses;

    beforeEach(() => {
        sut = include("lib/filter-validated-addresses");
        googleResponses = [];
    });

    describe("when executing", () => {
        describe("with no responses with OK status", () => {
            beforeEach(() => {
                googleResponses.push(
                    {
                        status: "BOO",
                        results: []
                    },
                    {
                        status: "blah",
                        results: []
                    });
            });

            it("should resolve promise with empty list", () => {
                return sut(googleResponses).should.eventually.have.lengthOf(0);
            });
        });

        describe("with responses of status OK", () => {
            describe("but not ROOFTOP location type", () => {
                beforeEach(() => {
                    googleResponses.push(
                        {
                            status: "OK",
                            results: [
                                {
                                    formatted_address: "sesame street",
                                    geometry: {
                                        location_type: "FOO"
                                    }
                                }
                            ]
                        },
                        {
                            status: "OK",
                            results: []
                        });
                });

                it("should resolve empty addresses", () => {
                    return sut(googleResponses).should.eventually.have.lengthOf(0);
                });
            });

            describe("and ROOFTOP location type", () => {
                let formattedAddress;

                beforeEach(() => {
                    formattedAddress = "verified address";

                    googleResponses.push({
                        status: "OK",
                        results: [
                            {
                                formatted_address: formattedAddress,
                                geometry: {
                                    location_type: "ROOFTOP"
                                }
                            }
                        ]
                    },
                    {
                        status: "OK",
                        results: [
                            {
                                formatted_address: formattedAddress,
                                geometry: {
                                    location_type: "ROOFTOP"
                                }
                            }
                        ]
                    });
                });

                it("should resolve ROOFTOP addresses", (done) => {
                    sut(googleResponses).then((addresses) => {
                        addresses.length.should.equal(2);
                        addresses.forEach((address) => {
                            address.should.equal(formattedAddress);
                        });

                        done();
                    });
                });
            });
        });
    });
});