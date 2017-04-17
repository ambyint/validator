describe(__filename, () => {
    let sandbox, sut, googleStub, googleClientStub, asyncStub, config;

    beforeEach(() => {
        sandbox = sinon.sandbox.create()

        googleStub = {
            createClient: sandbox.stub()
        };

        googleClientStub = {
            geocode: sandbox.stub()
        };

        config = {
            googleApiKey: "myKey"
        };

        googleStub.createClient.returns(googleClientStub);

        sut = include("lib/validate-addresses", {"@google/maps": googleStub})
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("when executing", () => {
        it("should create google client with api key from config", (done) => {
            sut(config)([]).then(() => {
                googleStub.createClient.should.have.been.calledWithExactly(sinon.match({
                    key: config.googleApiKey
                }));

                done();
            });
        });

        describe("with addresses to validate", () => {
            let address, addressesToValidate = [];

            beforeEach(() => {
                address = "sesame street";
                addressesToValidate.push(address);

                googleClientStub.geocode.yields(null, { json: {}});
            });

            it("should geocode address", (done) => {
                sut(config)(addressesToValidate).then(() => {
                    googleClientStub.geocode.should.have.been.calledWith(sinon.match({ address: address}), sinon.match.func);
                    done();
                });
            });

            describe("when google client errors", () => {
                beforeEach(() => {
                    googleClientStub.geocode.yields("err");
                });

                it("should reject promise", () => {
                    return sut(config)(addressesToValidate).should.eventually.be.rejectedWith("err");
                })
            });

            describe("when google client success", () => {
                let response;

                beforeEach(() => {
                    response = {
                        json: {
                            foo: "bar"
                        }
                    };

                    googleClientStub.geocode.yields(null, response);
                });

                it("should resolve promise", (done) => {
                    sut(config)(addressesToValidate).then((responses) => {
                        responses.should.have.lengthOf(1);
                        responses[0].should.equal(response.json);

                        done();
                    });
                });
            });
        });
    });
});