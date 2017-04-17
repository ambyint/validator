describe(__filename, () => {
    let sandbox, sut, fsStub, streamStub, readlineStub, readerStub;

    const options = {};

    beforeEach(() => {
        sandbox = sinon.sandbox.create();

        fsStub = {
            createReadStream: sandbox.stub()
        };

        streamStub = sandbox.stub();

        readerStub = {
            on: sandbox.stub(),
        };

        readlineStub = {
            createInterface: sandbox.stub(),
        };

        options.filename = "my file";

        readlineStub.createInterface.returns(readerStub);

        readerStub.on.withArgs("line").returns(readerStub);

        fsStub.createReadStream.returns(streamStub);

        sut = include("lib/load-addresses-to-validate", {"fs": fsStub, "readline" : readlineStub})
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("when executing", () => {
        it("should create readstream from filenname in options", () => {
            sut(options).then(() => {
                fsStub.createReadStream.should.have.been.calledWithExactly(options.filename);
            });
        });

        it("should create interface with input stream from fs", () => {
            sut(options).then(() => {
                readlineStub.createInterface.should.have.been.calledWithExactly(sinon.matches({
                    input: streamStub
                }));
            });
        });

        describe("with reader on", () => {
            describe("line", () => {

                let line;

                beforeEach(() => {
                    line = `"address that needs to be validated"`;

                    readerStub.on.withArgs("line").yields(line);
                    readerStub.on.withArgs("close").yields();
                });

                describe("when options.containsHeader", () => {
                    describe("is true", () => {
                        beforeEach(() => {
                            options.containsHeader = true;
                        });

                        it("should not include first row in list of addresses to validate", () => {
                            return sut(options).should.eventually.have.lengthOf(0);
                        });
                    });

                    describe("is false", () => {
                        beforeEach(() => {
                            options.containsHeader = false;
                        });

                        it("should include first row in list of addresses to validate", () => {
                            return sut(options).should.eventually.have.lengthOf(1);
                        });
                    });
                });

                it("should replace quotation marks", (done) => {
                    sut(options).then((addresses) => {
                        addresses[0].indexOf('"').should.equal(-1);
                        done();
                    });
                });

                it("should replace spaces with plus", (done) => {
                    sut(options).then((addresses) => {
                        addresses[0].indexOf(" ").should.equal(-1);
                        addresses[0].match(/\+/g).length.should.equal(line.match(/ /g).length);
                        done();
                    });
                });
            });

            describe("close", () => {
                it("should resolve promise with addresses", () => {
                    return sut(options).should.resolve;
                });
            });
        });
    });
});