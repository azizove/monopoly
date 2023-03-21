const Monopoly = artifacts.require("Monopoly");
const MoneyPoly = artifacts.require("MoneyPoly");

module.exports = function(deployer) {
  deployer.deploy(MoneyPoly).then(function() {
    return deployer.deploy(Monopoly, "0xA1D608aE4EeBeA351108c999e6f373B1514fD2Ea", MoneyPoly.address);
  });
};
