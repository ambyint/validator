const chai = require('chai');
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");

global.sinon = require('sinon');

chai.use(sinonChai);
chai.use(chaiAsPromised)
chai.should();
chai.expect();




