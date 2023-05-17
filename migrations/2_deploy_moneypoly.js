const MoneyPoly = artifacts.require("MoneyPoly");

module.exports = function(deployer) {
  deployer.deploy(MoneyPoly);
};