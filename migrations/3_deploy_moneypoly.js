const Contract = artifacts.require("./MoneyPoly.sol");

module.exports = function(deployer) {
  deployer.deploy(Contract);
};