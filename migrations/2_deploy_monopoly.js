const Contract = artifacts.require("./Monopoly.sol");

module.exports = function(deployer) {
  deployer.deploy(Contract);
};